# 实时

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt). 如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

## 域类型

### 音频转写

- `AudioTranscription object { delay, keywords, language, 3 more }`

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转写文本之前等待多长时间。
    较高的值可以提高转写准确度，但会增加延迟。
    仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在以下字段中提供输入语言：
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    可提高准确度并降低延迟。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    可选的文本，用于引导模型风格或延续之前的音频
    片段。
    对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
    Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

### 对话创建事件

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

### 会话项

- `ConversationItem = RealtimeConversationItemSystemMessage or RealtimeConversationItemUserMessage or RealtimeConversationItemAssistantMessage or 6 more`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终 `input_text` 用于系统消息。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（用于 `input_text`).

      - `transcript: optional string`

        音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    实时对话中的助手消息项。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的转录文本；如果输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    实时对话中的函数调用项。

    - `arguments: string`

      函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    实时对话中的函数调用输出项。

    - `call_id: string`

      此输出所对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

      所回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终 `mcp_approval_response`.

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

        关于该工具的附加注解。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    表示对 MCP 服务器上工具进行调用的 Realtime item。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数组成的 JSON 字符串。

    - `name: string`

      所运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终 `mcp_call`.

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

    一个请求人工批准工具调用的 Realtime 项目。

    - `id: string`

      该批准请求的唯一 ID。

    - `arguments: string`

      该工具的 JSON 字符串形式参数。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起该请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终 `mcp_approval_request`.

      - `"mcp_approval_request"`

### 已添加对话项

- `ConversationItemAdded object { event_id, item, type, previous_item_id }`

  当一个 Item 被添加到默认会话时由服务端发送。可能出现在以下几种情况：

  - 当客户端发送 `conversation.item.create` 事件时。
  - 当输入音频缓冲区被提交时。在这种情况下，该 item 将是一条用户消息，其中包含缓冲区中的音频。
  - 当模型正在生成 Response 时。在这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它此时尚不包含任何内容（且 `status` 将为 `in_progress`).

  该事件将包含 Item 的完整内容（模型正在生成 Response 时除外），但音频数据除外，音频数据可以在需要时通过单独的 `conversation.item.retrieve` 事件获取。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终 `input_text` 用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        所回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终 `mcp_approval_response`.

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

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上工具进行调用的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数组成的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终 `mcp_call`.

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

      一个请求人工批准工具调用的 Realtime 项目。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的 JSON 字符串形式参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.added"`

    事件类型，必须为 `conversation.item.added`.

    - `"conversation.item.added"`

  - `previous_item_id: optional string or null`

    位于此项之前的 item 的 ID（如果有）。该字段用于
    在插入 item 时保持顺序。

### 对话项创建事件

- `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

  向会话上下文添加一个新 Item，包括消息、函数
  调用以及函数调用响应。该事件既可用于填充会话的
  “历史记录”，也可用于在流式传输过程中添加新项，但存在以下
  当前限制：无法填充助手音频消息。

  如果成功，服务端将发出一个 `conversation.item.added` 事件，并且，
  在该项最终确定时发出一个 `conversation.item.done` 事件。否则，将发送一个
  `error` 事件。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终 `input_text` 用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        所回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终 `mcp_approval_response`.

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

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上工具进行调用的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数组成的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终 `mcp_call`.

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

      一个请求人工批准工具调用的 Realtime 项目。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的 JSON 字符串形式参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.create"`

    事件类型，必须为 `conversation.item.create`.

    - `"conversation.item.create"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

  - `previous_item_id: optional string`

    新项将插入到其后的前一项的 ID。如果未设置，新项将追加到会话末尾。

    如果设置为 `root`,新项将添加到会话的开头。

    如果设置为现有 ID，则允许在会话中间插入一个项。如果找不到该 ID，将返回错误，并且不会添加该项。

### 会话条目创建事件

- `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

  在创建会话项时返回。以下几种场景会产生该事件：

  - 服务端正在生成一个 Response，如果成功，它将生成
    一个或两个 Item，其类型为 `message`
    （role `assistant`）或类型 `function_call`.
  - 输入音频缓冲区已提交，由客户端或
    服务端（在 `server_vad` 模式下）提交。服务端将获取
    输入音频缓冲区的内容，并将其添加到一个新的用户消息 Item 中。
  - 客户端发送了 `conversation.item.create` 事件以向 Conversation 添加一个新 Item
    到会话中。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终 `input_text` 用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        所回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终 `mcp_approval_response`.

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

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上工具进行调用的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数组成的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终 `mcp_call`.

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

      一个请求人工批准工具调用的 Realtime 项目。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的 JSON 字符串形式参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.created"`

    事件类型，必须为 `conversation.item.created`.

    - `"conversation.item.created"`

  - `previous_item_id: optional string or null`

    Conversation 上下文中前一个 Item 的 ID，便于
    客户端了解会话的顺序。可以是 `null` （如果该
    Item 没有前驱项）。

### 对话项删除事件

- `ConversationItemDeleteEvent object { item_id, type, event_id }`

  当你想要从对话中移除某个条目时，发送此事件
  历史。服务器将以 `conversation.item.deleted` 事件响应，
  除非该条目不存在于对话历史中，此时
  服务器将返回错误。

  - `item_id: string`

    要删除的条目 ID。

  - `type: "conversation.item.delete"`

    事件类型，必须为 `conversation.item.delete`.

    - `"conversation.item.delete"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 对话项删除事件

- `ConversationItemDeletedEvent object { event_id, item_id, type }`

  当会话中的某个 item 由客户端通过以下方式删除时返回：
  `conversation.item.delete` event。此 event 用于将服务端对会话历史的理解与客户端的视图进行
  同步。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    已删除 item 的 ID。

  - `type: "conversation.item.deleted"`

    事件类型，必须为 `conversation.item.deleted`.

    - `"conversation.item.deleted"`

### 对话项已完成

- `ConversationItemDone object { event_id, item, type, previous_item_id }`

  在对话条目完成时返回。

  该事件将包含 Item 的完整内容，但音频数据除外，音频数据可在需要时通过以下方式单独检索： `conversation.item.retrieve` 事件（如有需要）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终 `input_text` 用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        所回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终 `mcp_approval_response`.

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

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上工具进行调用的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数组成的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终 `mcp_call`.

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

      一个请求人工批准工具调用的 Realtime 项目。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的 JSON 字符串形式参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.done"`

    事件类型，必须为 `conversation.item.done`.

    - `"conversation.item.done"`

  - `previous_item_id: optional string or null`

    位于此项之前的 item 的 ID（如果有）。该字段用于
    在插入 item 时保持顺序。

### 会话项目输入音频转录完成事件

- `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

  此事件是写入
  用户音频缓冲区的音频转录输出。当输入音频缓冲区由客户端或服务端提交时（启用 VAD 时），转录开始。转录
  由客户端或服务端提交（启用 VAD 时）时开始。转录
  与 Response 创建异步进行，因此此事件可能会出现在
  Response 事件之前或之后。

  Realtime API 模型原生支持音频，因此输入转录是
  单独的过程，在单独的 ASR（自动语音识别）模型上运行。
  转录文本可能与模型的理解略有出入，并且
  应视为大致参考。

  - `content_index: number`

    包含音频的内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    正在转录的音频所在条目的 ID。

  - `transcript: string`

    转录后的文本。

  - `type: "conversation.item.input_audio_transcription.completed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.completed`.

    - `"conversation.item.input_audio_transcription.completed"`

  - `usage: Tokens { input_tokens, output_tokens, total_tokens, 2 more }  or Duration { seconds, type }`

    本次转录的使用统计，按 ASR 模型的定价计费，而不是实时模型的定价。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 使用量计费的模型的使用统计。

      - `input_tokens: number`

        本次请求计费的输入 token 数。

      - `output_tokens: number`

        生成的输出 token 数。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        使用对象的类型。始终为 `tokens` 。

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

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        使用对象的类型。始终为 `duration` 。

        - `"duration"`

  - `languages: optional array of TranscriptionLanguage`

    在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测出任何语言。

    - `code: string`

      在音频中检测到的语言代码。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。

    - `token: string`

      用于生成对数概率的 token。

    - `bytes: array of number`

      用于生成对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项输入音频转写增量事件

- `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

  在输入音频转写内容部分的文本值通过增量转写结果被更新时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    正在转录的音频所在条目的 ID。

  - `type: "conversation.item.input_audio_transcription.delta"`

    事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

    - `"conversation.item.input_audio_transcription.delta"`

  - `content_index: optional number`

    条目内容数组中内容部分的索引。

  - `delta: optional string`

    文本增量。

  - `logprobs: optional array of LogProbProperties or null`

    转写的对数概率。可通过将会话配置为 `"include": ["item.input_audio_transcription.logprobs"]`。来启用。数组中的每个条目对应此转写片段可能被选中的某个 token 的对数概率。这有助于判断在给定的转写片段中是否存在多个有效选项。

    - `token: string`

      用于生成对数概率的 token。

    - `bytes: array of number`

      用于生成对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项目输入音频转录失败事件

- `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

  当配置了输入音频转录，且转录
  用户消息的请求失败时返回。这些事件与其他
  `error` 事件分开，以便客户端识别相关的 Item。

  - `content_index: number`

    包含音频的内容部分的索引。

  - `error: object { code, message, param, type }`

    转录错误的详细信息。

    - `code: optional string`

      错误代码（如有）。

    - `message: optional string`

      易于理解的错误消息。

    - `param: optional string`

      与错误相关的参数（如有）。

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

  当某个条目识别出输入音频转写片段时返回。

  - `id: string`

    片段标识符。

  - `content_index: number`

    条目中输入音频内容部分的索引。

  - `end: number`

    片段的结束时间（以秒为单位）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    包含输入音频内容的条目 ID。

  - `speaker: string`

    此片段检测到的说话人标签。

  - `start: number`

    片段的开始时间（以秒为单位）。

  - `text: string`

    此片段的文本。

  - `type: "conversation.item.input_audio_transcription.segment"`

    事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

    - `"conversation.item.input_audio_transcription.segment"`

### 会话项检索事件

- `ConversationItemRetrieveEvent object { item_id, type, event_id }`

  当你希望检索服务器对会话历史中某个具体条目的表示时发送此事件。例如，可用于在噪声消除和 VAD 之后检查用户音频。
  服务器将返回一个 `conversation.item.retrieved` 事件响应，
  除非该条目不存在于对话历史中，此时
  服务器将返回错误。

  - `item_id: string`

    要检索的条目的 ID。

  - `type: "conversation.item.retrieve"`

    事件类型，必须为 `conversation.item.retrieve`.

    - `"conversation.item.retrieve"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 对话项截断事件

- `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

  发送该事件以截断之前助手消息的音频。服务端
  生成音频的速度快于实时，因此当你
  中断以截断已经发送到客户端但尚未
  播放的音频时，这个事件非常有用。这会使服务端对音频的理解与
  客户端的播放保持同步。

  截断音频会删除服务端的文本转录，以确保上下文
  中不会有用户尚未听到的文本。

  如果成功，服务端会响应一个 `conversation.item.truncated`
  事件时。

  - `audio_end_ms: number`

    音频截断的包含性时长上限（毫秒）。如果
    audio_end_ms 大于实际的音频时长，服务端
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

    用于标识此事件的可选客户端生成 ID。

### 对话项截断事件

- `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

  当客户端通过
  以下事件截断此前的助手音频消息项时返回： `conversation.item.truncate` 此事件用于
  将服务端对音频的理解与客户端的播放保持同步。

  此操作会截断音频并移除服务端文本转录，
  以确保上下文中没有用户尚未听到的文本。

  - `audio_end_ms: number`

    音频被截断的时长上限，单位为毫秒。

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
    的项，此字段允许客户端分配该项的唯一 ID。它是
    可选的，因为如果未提供，服务器将生成一个。

    对于类型为 `item_reference`，的项，此字段是必需的，并且是对
    话中先前存在的任意项的引用。

  - `arguments: optional string`

    函数调用的参数（对于 `function_call` 项）。

  - `call_id: optional string`

    函数调用的 ID（对于 `function_call` 和
    `function_call_output` 项）。如果传入到 `function_call_output`
    项，服务器将检查对话历史中是否 `function_call` 存在具有相同
    ID 的项。

  - `content: optional array of object { id, audio, text, 2 more }`

    消息的内容，适用于 `message` 项。

    - 角色为 `system` 的消息项仅支持 `input_text` 内容
    - 角色为 `user` 支持 `input_text` 和 `input_audio`
      内容
    - 角色为 `assistant` 支持 `text` 内容。

    - `id: optional string`

      要引用的先前对话项的 ID（用于 `item_reference`
      以下内容类型 `response.create` 事件）。这些项可以引用客户端和
      服务端创建的项。

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

    所调用函数的名称（用于 `function_call` 项）。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符 - 始终为 `realtime.item`.

    - `"realtime.item"`

  - `output: optional string`

    函数调用的输出（用于 `function_call_output` 项）。

  - `role: optional "user" or "assistant" or "system"`

    消息发送者的角色（`user`, `assistant`, `system`），仅适用于
    以下内容类型 `message` 项。

    - `"user"`

    - `"assistant"`

    - `"system"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    项的状态（`completed`, `incomplete`, `in_progress`）。这些属性对
    对话无影响，但为保持一致性而接受，与
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

  发送此事件可将音频字节追加到输入音频缓冲区。该音频
  缓冲区是一项你可以写入并在稍后提交的临时存储。"提交"会根据缓冲区内容在
  对话历史中创建一条新的用户消息条目，并清空缓冲区。
  在缓冲区提交时，会生成输入音频转录（如果已启用）。

  如果启用了 VAD，则音频缓冲区用于检测语音，并由服务端决定
  何时提交。当禁用服务端 VAD 时，你必须手动提交音频缓冲区。
  输入音频降噪会作用于对音频缓冲区的写入操作。

  客户端可以选择每个事件放入多少音频，最大不超过
  15 MiB；例如从客户端流式传输较小的数据块可能使 VAD 响应更加及时。
  与大多数其他客户端事件不同，服务端不
  会针对此事件发送确认响应。

  - `audio: string`

    经过 Base64 编码的音频字节。其格式必须与会话配置中指定的
    `input_audio_format` 字段一致。

  - `type: "input_audio_buffer.append"`

    事件类型，必须为 `input_audio_buffer.append`.

    - `"input_audio_buffer.append"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### Input Audio Buffer Clear Event

- `InputAudioBufferClearEvent object { type, event_id }`

  发送此事件以清除缓冲区中的音频字节。服务器将
  作出响应 `input_audio_buffer.cleared` 事件时。

  - `type: "input_audio_buffer.clear"`

    事件类型，必须为 `input_audio_buffer.clear`.

    - `"input_audio_buffer.clear"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 输入音频缓冲区已清除事件

- `InputAudioBufferClearedEvent object { event_id, type }`

  当客户端使用以下方式清除输入音频缓冲区时返回
  `input_audio_buffer.clear` 事件时。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "input_audio_buffer.cleared"`

    事件类型，必须为 `input_audio_buffer.cleared`.

    - `"input_audio_buffer.cleared"`

### Input Audio Buffer Commit 事件

- `InputAudioBufferCommitEvent object { type, event_id }`

  发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，该事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

  提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用了该功能），但不会从模型创建响应。服务端将响应一个 `input_audio_buffer.committed` 事件时。

  - `type: "input_audio_buffer.commit"`

    事件类型，必须为 `input_audio_buffer.commit`.

    - `"input_audio_buffer.commit"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 输入音频缓冲区已提交事件

- `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

  在输入音频缓冲区被提交时返回，无论是客户端提交还是在
  服务端 VAD 模式下自动提交。此处 `item_id` 属性是用户消息项的
  ID，因此会同时向客户端发送一条 `conversation.item.created` 事件
  。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将要创建的用户消息项的 ID。

  - `type: "input_audio_buffer.committed"`

    事件类型，必须为 `input_audio_buffer.committed`.

    - `"input_audio_buffer.committed"`

  - `previous_item_id: optional string or null`

    新项将插入到该前置项之后，该前置项的 ID。
    如果该项没有前置项，则可以为 `null` 。

### Input Audio Buffer Dtmf Event Received 事件

- `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

  **仅 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示电话键盘按键（0–9、*、#、A–D）的消息。
  属性为用户按下的键盘按键。 `event` 属性
  为用户按下的键盘按键。 `received_at` 是服务端收到事件的 UTC Unix 时间戳。
  表示服务端收到该事件的时间。

  - `event: string`

    用户按下的电话键盘按键。

  - `received_at: number`

    服务端收到 DTMF 事件时的 UTC Unix 时间戳。

  - `type: "input_audio_buffer.dtmf_event_received"`

    事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

    - `"input_audio_buffer.dtmf_event_received"`

### Input Audio Buffer Speech Started Event

- `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

  由服务端在 `server_vad` 模式下发送，提示已在音频缓冲区中检测到语音。
  检测到语音。只要有音频被添加进缓冲区就可能发生此事件
  （除非已经处于语音检测状态）。客户端可使用此事件
  来打断音频播放，或向用户提供视觉反馈。

  客户端应预期在语音停止时收到 `input_audio_buffer.speech_stopped` 事件
  语音停止事件。该 `item_id` 属性是将在语音停止时创建的用户消息项的 ID，该 ID
  也会出现在随后的语音停止事件中（除非客户端在 VAD 激活期间
  `input_audio_buffer.speech_stopped` 事件中手动提交音频缓冲区
  ）。

  - `audio_start_ms: number`

    从会话期间首次检测到语音时起，所有写入缓冲区
    的音频起始处算起的毫秒数。该时间对应于发送给
    模型的音频开头，因此包含在 Session 中配置的
    `prefix_padding_ms` 。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    语音停止时将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_started"`

    事件类型，必须为 `input_audio_buffer.speech_started`.

    - `"input_audio_buffer.speech_started"`

### 输入音频缓冲区语音停止事件

- `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

  返回于 `server_vad` 模式，当服务器检测到
  音频缓冲区中的语音结束时。服务器还会发送一个 `conversation.item.created`
  事件，其中包含根据音频缓冲区创建的用户消息项。

  - `audio_end_ms: number`

    语音停止时距会话开始所经过的毫秒数。这将
    对应于发送给模型的音频结束时间，因此包含
    `min_silence_duration_ms` 。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将要创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_stopped"`

    事件类型，必须为 `input_audio_buffer.speech_stopped`.

    - `"input_audio_buffer.speech_stopped"`

### 输入音频缓冲区超时触发

- `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

  当输入音频缓冲区触发 Server VAD 超时时返回。该配置在会话的设置中完成，表示在配置的时长内未检测到任何语音。
  在 `idle_timeout_ms` 会话的 `turn_detection` 设置中配置，表示在配置的时长内未检测到任何语音。
  在配置的时长内未检测到任何语音。

  该 `audio_start_ms` 和 `audio_end_ms` 字段表示从最后一次模型响应之后到触发时刻之间的音频片段，以写入输入音频缓冲区的起始时间为偏移量。这意味着它划定了那段静默的音频区间，且起始值与结束值之间的差值大致等于所配置的超时时长。
  模型响应之后到触发时刻的音频片段，作为距写入输入音频缓冲区起始处的偏移量。
  这意味着它划定了静默的音频片段，且
  起始值和结束值之间的差值大致等于所配置的超时时长。

  空音频将作为一项（item）提交到对话中（将产生 `input_audio` 一个 item 事件），并将生成模型响应。可能存在一些语音未触发 VAD 但仍被模型检测到的情况，因此模型可能会
  `input_audio_buffer.committed` 事件），并将生成一个模型响应。可能存在一些语音
  未触发 VAD，但仍然被模型检测到，因此模型可能会以与对话相关的内容或继续说话的提示进行回复。
  做出与对话相关的内容或继续说话的提示。

  - `audio_end_ms: number`

    触发超时时写入输入音频缓冲区的音频的毫秒偏移量。

  - `audio_start_ms: number`

    在最后一次模型响应的播放时间之后，写入输入音频缓冲区的音频的毫秒偏移量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    与此片段关联的 item 的 ID。

  - `type: "input_audio_buffer.timeout_triggered"`

    事件类型，必须为 `input_audio_buffer.timeout_triggered`.

    - `"input_audio_buffer.timeout_triggered"`

### Log Prob Properties

- `LogProbProperties object { token, bytes, logprob }`

  一个 log 概率对象。

  - `token: string`

    用于生成对数概率的 token。

  - `bytes: array of number`

    用于生成对数概率的字节。

  - `logprob: number`

    该 token 的对数概率。

### Mcp List Tools Completed

- `McpListToolsCompleted object { event_id, item_id, type }`

  当列出 MCP 工具针对某个条目完成时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具条目的 ID。

  - `type: "mcp_list_tools.completed"`

    事件类型，必须为 `mcp_list_tools.completed`.

    - `"mcp_list_tools.completed"`

### Mcp 工具列表检索失败

- `McpListToolsFailed object { event_id, item_id, type }`

  在列出某个项目的 MCP 工具失败时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具条目的 ID。

  - `type: "mcp_list_tools.failed"`

    事件类型，必须为 `mcp_list_tools.failed`.

    - `"mcp_list_tools.failed"`

### Mcp 列出工具 进行中

- `McpListToolsInProgress object { event_id, item_id, type }`

  在某个项目的 MCP 工具列举进行中时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具条目的 ID。

  - `type: "mcp_list_tools.in_progress"`

    事件类型，必须为 `mcp_list_tools.in_progress`.

    - `"mcp_list_tools.in_progress"`

### 降噪类型

- `NoiseReductionType = "near_field" or "far_field"`

  降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

  - `"near_field"`

  - `"far_field"`

### 输出音频缓冲区清除事件

- `OutputAudioBufferClearEvent object { type, event_id }`

  **仅限 WebRTC/SIP：** 用于切断当前的音频响应。这会触发服务端
  停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
  事件之前应发送一个 `response.cancel` 客户端事件以停止
  当前响应的生成。
  [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

  - `type: "output_audio_buffer.clear"`

    事件类型，必须为 `output_audio_buffer.clear`.

    - `"output_audio_buffer.clear"`

  - `event_id: optional string`

    用于错误处理的客户端事件的唯一 ID。

### 速率限制更新事件

- `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

  在 Response 开始时发出，用于指示更新后的速率限制。
  创建 Response 时，部分 token 将被“预留”用于输出
  token，此处显示的速率限制反映了该预留，并在
  Response 完成后进行相应调整。

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
      降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待多长时间。
        较高的值可以提高转写准确度，但会增加延迟。
        仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在以下字段中提供输入语言：
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可提高准确度并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于引导模型风格或延续之前的音频
        片段。
        对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，到时后将自动触发模型响应。这在
          用户长时间停顿出乎意料的场景下非常有用，例如电话
          通话。模型将有效地基于当前上下文提示用户继续对话。
          在当前上下文下，提示用户继续对话。

          超时值将在上一次模型响应的音频播放完毕后开始计算，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 关联的)将在达到超时时间时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否自动中断（取消）默认
          会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
          毫秒）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
          为 500 毫秒。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更响亮的音频才能激活模型，
          因此在嘈杂环境下可能会有更好的表现。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD 停止事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当默认设备产生输出时，是否自动中断任何正在进行的响应
          会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应的速度，是原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

      此参数是对生成后音频的后处理调整，
      也可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

      模型用于响应的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
      会话期间在模型至少响应过一次音频后更改。
      自定义声音必须由音频样本创建。
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

        自定义音色参考。

        - `id: string`

          自定义音色 ID，例如 `voice_1234`.

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
    降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转写文本之前等待多长时间。
      较高的值可以提高转写准确度，但会增加延迟。
      仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在以下字段中提供输入语言：
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      可提高准确度并降低延迟。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      可选的文本，用于引导模型风格或延续之前的音频
      片段。
      对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
      Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

  - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

    轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，到时后将自动触发模型响应。这在
        用户长时间停顿出乎意料的场景下非常有用，例如电话
        通话。模型将有效地基于当前上下文提示用户继续对话。
        在当前上下文下，提示用户继续对话。

        超时值将在上一次模型响应的音频播放完毕后开始计算，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 关联的)将在达到超时时间时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否自动中断（取消）默认
        会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
        毫秒）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
        为 500 毫秒。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更响亮的音频才能激活模型，
        因此在嘈杂环境下可能会有更好的表现。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD 停止事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当默认设备产生输出时，是否自动中断任何正在进行的响应
        会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

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

    模型语音响应的速度，是原始速度的倍数。
    1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

    此参数是对生成后音频的后处理调整，
    也可以通过提示让模型说得更快或更慢。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

    模型用于响应的声音。支持的内置声音包括
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
    `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
    一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
    会话期间在模型至少响应过一次音频后更改。
    自定义声音必须由音频样本创建。
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

      自定义音色参考。

      - `id: string`

        自定义音色 ID，例如 `voice_1234`.

### Realtime Audio Formats

- `RealtimeAudioFormats = PCMAudio { rate, type }  or PCMUAudio { type }  or PCMAAudio { type }`

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

- `RealtimeAudioInputTurnDetection = ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，到时后将自动触发模型响应。这在
      用户长时间停顿出乎意料的场景下非常有用，例如电话
      通话。模型将有效地基于当前上下文提示用户继续对话。
      在当前上下文下，提示用户继续对话。

      超时值将在上一次模型响应的音频播放完毕后开始计算，
      即设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      与 Response 关联的)将在达到超时时间时发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD 开始事件发生时，是否自动中断（取消）默认
      会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
      毫秒）。默认为 300 毫秒。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
      为 500 毫秒。该值越小，模型响应越快，
      但可能会在用户短暂的停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
      高的阈值需要更响亮的音频才能激活模型，
      因此在嘈杂环境下可能会有更好的表现。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD 停止事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当默认设备产生输出时，是否自动中断任何正在进行的响应
      会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

### Realtime Client Event

- `RealtimeClientEvent = ConversationItemCreateEvent or ConversationItemDeleteEvent or ConversationItemRetrieveEvent or 8 more`

  一个实时客户端事件。

  - `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

    向会话上下文添加一个新 Item，包括消息、函数
    调用以及函数调用响应。该事件既可用于填充会话的
    “历史记录”，也可用于在流式传输过程中添加新项，但存在以下
    当前限制：无法填充助手音频消息。

    如果成功，服务端将发出一个 `conversation.item.added` 事件，并且，
    在该项最终确定时发出一个 `conversation.item.done` 事件。否则，将发送一个
    `error` 事件。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终 `input_text` 用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          所回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终 `mcp_approval_response`.

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

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上工具进行调用的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数组成的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终 `mcp_call`.

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

        一个请求人工批准工具调用的 Realtime 项目。

        - `id: string`

          该批准请求的唯一 ID。

        - `arguments: string`

          该工具的 JSON 字符串形式参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起该请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.create"`

      事件类型，必须为 `conversation.item.create`.

      - `"conversation.item.create"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

    - `previous_item_id: optional string`

      新项将插入到其后的前一项的 ID。如果未设置，新项将追加到会话末尾。

      如果设置为 `root`,新项将添加到会话的开头。

      如果设置为现有 ID，则允许在会话中间插入一个项。如果找不到该 ID，将返回错误，并且不会添加该项。

  - `ConversationItemDeleteEvent object { item_id, type, event_id }`

    当你想要从对话中移除某个条目时，发送此事件
    历史。服务器将以 `conversation.item.deleted` 事件响应，
    除非该条目不存在于对话历史中，此时
    服务器将返回错误。

    - `item_id: string`

      要删除的条目 ID。

    - `type: "conversation.item.delete"`

      事件类型，必须为 `conversation.item.delete`.

      - `"conversation.item.delete"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `ConversationItemRetrieveEvent object { item_id, type, event_id }`

    当你希望检索服务器对会话历史中某个具体条目的表示时发送此事件。例如，可用于在噪声消除和 VAD 之后检查用户音频。
    服务器将返回一个 `conversation.item.retrieved` 事件响应，
    除非该条目不存在于对话历史中，此时
    服务器将返回错误。

    - `item_id: string`

      要检索的条目的 ID。

    - `type: "conversation.item.retrieve"`

      事件类型，必须为 `conversation.item.retrieve`.

      - `"conversation.item.retrieve"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

    发送该事件以截断之前助手消息的音频。服务端
    生成音频的速度快于实时，因此当你
    中断以截断已经发送到客户端但尚未
    播放的音频时，这个事件非常有用。这会使服务端对音频的理解与
    客户端的播放保持同步。

    截断音频会删除服务端的文本转录，以确保上下文
    中不会有用户尚未听到的文本。

    如果成功，服务端会响应一个 `conversation.item.truncated`
    事件时。

    - `audio_end_ms: number`

      音频截断的包含性时长上限（毫秒）。如果
      audio_end_ms 大于实际的音频时长，服务端
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

      用于标识此事件的可选客户端生成 ID。

  - `InputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件可将音频字节追加到输入音频缓冲区。该音频
    缓冲区是一项你可以写入并在稍后提交的临时存储。"提交"会根据缓冲区内容在
    对话历史中创建一条新的用户消息条目，并清空缓冲区。
    在缓冲区提交时，会生成输入音频转录（如果已启用）。

    如果启用了 VAD，则音频缓冲区用于检测语音，并由服务端决定
    何时提交。当禁用服务端 VAD 时，你必须手动提交音频缓冲区。
    输入音频降噪会作用于对音频缓冲区的写入操作。

    客户端可以选择每个事件放入多少音频，最大不超过
    15 MiB；例如从客户端流式传输较小的数据块可能使 VAD 响应更加及时。
    与大多数其他客户端事件不同，服务端不
    会针对此事件发送确认响应。

    - `audio: string`

      经过 Base64 编码的音频字节。其格式必须与会话配置中指定的
      `input_audio_format` 字段一致。

    - `type: "input_audio_buffer.append"`

      事件类型，必须为 `input_audio_buffer.append`.

      - `"input_audio_buffer.append"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `InputAudioBufferClearEvent object { type, event_id }`

    发送此事件以清除缓冲区中的音频字节。服务器将
    作出响应 `input_audio_buffer.cleared` 事件时。

    - `type: "input_audio_buffer.clear"`

      事件类型，必须为 `input_audio_buffer.clear`.

      - `"input_audio_buffer.clear"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `OutputAudioBufferClearEvent object { type, event_id }`

    **仅限 WebRTC/SIP：** 用于切断当前的音频响应。这会触发服务端
    停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
    事件之前应发送一个 `response.cancel` 客户端事件以停止
    当前响应的生成。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `type: "output_audio_buffer.clear"`

      事件类型，必须为 `output_audio_buffer.clear`.

      - `"output_audio_buffer.clear"`

    - `event_id: optional string`

      用于错误处理的客户端事件的唯一 ID。

  - `InputAudioBufferCommitEvent object { type, event_id }`

    发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，该事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

    提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用了该功能），但不会从模型创建响应。服务端将响应一个 `input_audio_buffer.committed` 事件时。

    - `type: "input_audio_buffer.commit"`

      事件类型，必须为 `input_audio_buffer.commit`.

      - `"input_audio_buffer.commit"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `ResponseCancelEvent object { type, event_id, response_id }`

    发送此事件可取消正在进行的响应。服务端将响应一个
    包含一个 `response.done` 事件，其状态为 `response.status=cancelled`。如果没有可取消的响应，服务端将返回错误。即使没有正在进行的响应，调用
    没有正在进行的响应时，调用该事件是安全的，服务端将返回错误，会话不会受到影响。
    也是安全的； `response.cancel` 即便没有响应正在进行，也会返回错误，但
    会话将保持不受影响。

    - `type: "response.cancel"`

      事件类型，必须为 `response.cancel`.

      - `"response.cancel"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

    - `response_id: optional string`

      要取消的特定响应 ID——如果未提供，将取消
      默认对话中的进行中响应。

  - `ResponseCreateEvent object { type, event_id, response }`

    此事件指示服务端创建一个 Response，即触发
    模型推理。在 Server VAD 模式下，服务端会自动创建 Responses
    。

    一个 Response 至少包含一个 Item，也可能包含两个，此时
    第二个 Item 将是函数调用。这些 Item 默认会追加到
    对话历史中。

    服务器将返回一个 `response.created` 事件，以及为已创建 Items
    和内容生成的事件，最后是一个 `response.done` 事件，用于表示
    响应已完成。

    该 `response.create` 事件包含以下推理配置：
    `instructions` 和 `tools`。如果设置了这些配置，则会覆盖 Session 的
    配置，且仅适用于此 Response。

    可以在默认 Conversation 之外创建 Responses，这意味着它们可以
    可以有任意输入，并且可以禁用向 Conversation 写入输出。
    同一时刻只有一个 Response 可以向默认 Conversation 写入，但除此之外，多个
    Response 可以并行创建。 `metadata` 字段是区分多个并发
    Response 的好方法。

    客户端可以设置 `conversation` 为 `none` 以创建一个不写入默认 conversation 的 Response
    任意输入可以通过 `input` 字段提供，这是一个接受
    原始 Item 及对现有 Item 的引用。

    - `type: "response.create"`

      事件类型，必须为 `response.create`.

      - `"response.create"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

    - `response: optional RealtimeResponseCreateParams`

      使用这些参数创建一个新的 Realtime 响应。

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

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

            模型用于响应的声音。支持的内置声音包括
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
            一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
            会话期间在模型至少响应过一次音频后更改。
            自定义声音必须由音频样本创建。
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

              自定义音色参考。

              - `id: string`

                自定义音色 ID，例如 `voice_1234`.

      - `conversation: optional string or "auto" or "none"`

        控制将响应添加到哪个对话。当前支持
        `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
        表示响应内容将添加到默认
        对话中。将此设置为 `none` 可创建带外响应，该响应
        不会向默认对话添加项。

        - `string`

        - `"auto" or "none"`

          控制将响应添加到哪个对话。当前支持
          `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
          表示响应内容将添加到默认
          对话中。将此设置为 `none` 可创建带外响应，该响应
          不会向默认对话添加项。

          - `"auto"`

          - `"none"`

      - `input: optional array of ConversationItem`

        要包含在模型提示词中的输入项。使用此字段
        会为此 Response 创建新上下文，而非使用默认
        对话。空数组 `[]` 将清除此 Response 的上下文。
        请注意，其中可能包含对此前会话中已出现项的引用
        并使用其 id。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          实时对话中的助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          实时对话中的函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          实时对话中的函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的实时项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          用于列出 MCP 服务器上可用工具的 Realtime item。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          表示对 MCP 服务器上工具进行调用的 Realtime item。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          一个请求人工批准工具调用的 Realtime 项目。

      - `instructions: optional string`

        预先添加到模型调用中的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可指示模型的响应内容和格式（例如“务必简洁”“表现友好”“以下是优秀响应的示例”），以及音频行为（例如“快速说话”“在声音中注入情感”“经常笑”）。模型不保证遵循这些指令，但这些指令为模型期望行为提供了指导。
        请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        其中包含工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
        默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        一组 16 个键值对，可附加到对象上。这可以
        用于以结构化
        格式存储有关对象的额外信息，并通过 API 或控制面板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        ，最大长度为 512 个字符。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前唯一可能的取值为
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        输出设为 `text` 模式将禁用模型的音频输出。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以在并行调用多个工具。仅由
        reasoning Realtime 模型，例如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的
          提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，固定为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

              输入项的类型，固定为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，固定为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

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

        模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以自行选择生成消息或调用一个或
          多个工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用指定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用
            它的指引，以及在调用时应当向用户说明
            （的内容（如有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            采用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
            授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
            `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 取值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。以下之一： `always` 或
              `never`。设置为 `always`，时，所有工具都需要审批。设置为
              设置为 `never`，时，所有工具均不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `SessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新会话的配置。
    客户端可以随时发送此事件以更新任意字段，
    但以下字段除外： `voice` 和 `model`. `voice` 仅当尚未产生其他音频输出时才能更新。

    当服务器收到 `session.update`，时，将响应
    包含一个 `session.updated` 事件，事件中会显示完整且生效的配置。
    仅更新 `session.update` 中存在的字段。要清除某个字段（如
    `instructions`，传入空字符串。若要清除字段，例如 `tools`，传入空数组。
    若要清除字段，例如 `turn_detection`，传入 `null`.

    若要关闭输入音频降噪，请发送以下 Realtime 事件：

    ```json
    {"type":"session.update","session":{"type":"realtime","audio":{"input":{"noise_reduction":null}}}}
    ```

    对于转录会话，请使用 `"type":"transcription"` 在 `session`.
    从更新中省略 `audio.input.noise_reduction` 会保持其当前设置不变。

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
              降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional AudioTranscription`

              输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

              - `delay: optional "minimal" or "low" or "medium" or 2 more`

                控制模型在输出转写文本之前等待多长时间。
                较高的值可以提高转写准确度，但会增加延迟。
                仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

                - `"minimal"`

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"xhigh"`

              - `keywords: optional array of string`

                用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `language: optional string`

                输入音频的语言。在以下字段中提供输入语言：
                [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
                可提高准确度并降低延迟。

              - `languages: optional array of string`

                输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                可选的文本，用于引导模型风格或延续之前的音频
                片段。
                对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
                对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
                Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

            - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

              轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，到时后将自动触发模型响应。这在
                  用户长时间停顿出乎意料的场景下非常有用，例如电话
                  通话。模型将有效地基于当前上下文提示用户继续对话。
                  在当前上下文下，提示用户继续对话。

                  超时值将在上一次模型响应的音频播放完毕后开始计算，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 关联的)将在达到超时时间时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否自动中断（取消）默认
                  会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
                  毫秒）。默认为 300 毫秒。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
                  为 500 毫秒。该值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更响亮的音频才能激活模型，
                  因此在嘈杂环境下可能会有更好的表现。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD 停止事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当默认设备产生输出时，是否自动中断任何正在进行的响应
                  会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

          - `output: optional RealtimeAudioConfigOutput`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音响应的速度，是原始速度的倍数。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

              此参数是对生成后音频的后处理调整，
              也可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

              模型用于响应的声音。支持的内置声音包括
              `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
              `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
              一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
              会话期间在模型至少响应过一次音频后更改。
              自定义声音必须由音频样本创建。
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

                自定义音色参考。

                - `id: string`

                  自定义音色 ID，例如 `voice_1234`.

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的额外字段。

          `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

          请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          其中包含工具调用。提供 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
          默认为 `inf`.

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

          模型可以回复的模态集合。默认值为 `["audio"]`，表示
          使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
          模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `parallel_tool_calls: optional boolean`

          模型是否可以在并行调用多个工具。仅由
          reasoning Realtime 模型，例如 `gpt-realtime-2`.

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `reasoning: optional RealtimeReasoning`

          支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `tool_choice: optional RealtimeToolChoiceConfig`

          模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪个工具（若有）。

            `none` 表示模型将不调用任何工具，而是生成一条消息。

            `auto` 表示模型可以自行选择生成消息或调用一个或
            多个工具。

            `required` 表示模型必须调用一个或多个工具。

          - `ToolChoiceFunction object { name, type }`

            使用此选项可强制模型调用指定的函数。

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

        - `tools: optional RealtimeToolsConfig`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
            (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中识别它。

            - `type: "mcp"`

              MCP 工具的类型，始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
              服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
              授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
              `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
              通过安全 MCP 隧道进行连接。

              当前支持的 `connector_id` 取值包括：

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

              此 MCP 工具是否为延迟加载，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的筛选对象
                ，这些工具需要审批。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                    MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    进行了标注，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                    MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    进行了标注，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。以下之一： `always` 或
                `never`。设置为 `always`，时，所有工具都需要审批。设置为
                设置为 `never`，时，所有工具均不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
              `tunnel_id` 必须提供。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `tracing: optional RealtimeTracingConfig or null`

          Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
          为会话启用追踪，便无法修改配置。

          `auto` 将使用以下默认值为此会话创建追踪：
          工作流名称、组 ID 和元数据。

          - `Auto = "auto"`

            启用追踪并设置追踪配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            用于追踪的精细配置。

            - `group_id: optional string`

              附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
              分组。

            - `metadata: optional unknown`

              附加到此追踪的任意元数据，用于启用
              Traces Dashboard 中的筛选。

            - `workflow_name: optional string`

              附加到此追踪的工作流名称。用于在 Traces Dashboard 中
              为此追踪命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

          客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

          截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

          可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

          - `"auto" or "disabled"`

            本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

            - `retention_ratio: number`

              超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

            - `type: "retention_ratio"`

              使用按比例保留的截断方式。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

              - `post_instructions: optional number`

                指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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
              降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `transcription: optional AudioTranscription`

              输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

            - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

              轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，到时后将自动触发模型响应。这在
                  用户长时间停顿出乎意料的场景下非常有用，例如电话
                  通话。模型将有效地基于当前上下文提示用户继续对话。
                  在当前上下文下，提示用户继续对话。

                  超时值将在上一次模型响应的音频播放完毕后开始计算，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 关联的)将在达到超时时间时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否自动中断（取消）默认
                  会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
                  毫秒）。默认为 300 毫秒。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
                  为 500 毫秒。该值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更响亮的音频才能激活模型，
                  因此在嘈杂环境下可能会有更好的表现。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD 停止事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当默认设备产生输出时，是否自动中断任何正在进行的响应
                  会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的额外字段。

          `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。这是由客户端自行指定的任意字符串。如果该事件发生错误，它会被传回，但对应的 `session.updated` 事件将不会包含该 ID。

### Realtime 对话项助手消息

- `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

  实时对话中的助手消息项。

  - `content: array of object { audio, text, transcript, type }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

    - `text: optional string`

      文本内容。

    - `transcript: optional string`

      音频内容的转录文本；如果输出类型为 `audio`.

    - `type: optional "output_text" or "output_audio"`

      内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

      - `"output_text"`

      - `"output_audio"`

  - `role: "assistant"`

    消息发送者的角色。始终 `assistant`.

    - `"assistant"`

  - `type: "message"`

    条目的类型。始终 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项函数调用

- `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

  实时对话中的函数调用项。

  - `arguments: string`

    函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

  - `name: string`

    被调用函数的名称。

  - `type: "function_call"`

    条目的类型。始终 `function_call`.

    - `"function_call"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

  - `call_id: optional string`

    函数调用的 ID。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项函数调用输出

- `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

  实时对话中的函数调用输出项。

  - `call_id: string`

    此输出所对应的函数调用的 ID。

  - `output: string`

    函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

  - `type: "function_call_output"`

    条目的类型。始终 `function_call_output`.

    - `"function_call_output"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项系统消息

- `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

  Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

  - `content: array of object { text, type }`

    消息的内容。

    - `text: optional string`

      文本内容。

    - `type: optional "input_text"`

      内容类型。始终 `input_text` 用于系统消息。

      - `"input_text"`

  - `role: "system"`

    消息发送者的角色。始终 `system`.

    - `"system"`

  - `type: "message"`

    条目的类型。始终 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

      Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

    - `detail: optional "auto" or "low" or "high"`

      图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `image_url: optional string`

      Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

    - `text: optional string`

      文本内容（用于 `input_text`).

    - `transcript: optional string`

      音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

    - `type: optional "input_text" or "input_audio" or "input_image"`

      内容类型（`input_text`, `input_audio`，或 `input_image`).

      - `"input_text"`

      - `"input_audio"`

      - `"input_image"`

  - `role: "user"`

    消息发送者的角色。始终 `user`.

    - `"user"`

  - `type: "message"`

    条目的类型。始终 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

    易于理解的错误消息。

  - `type: string`

    错误类型（例如 "invalid_request_error"、"server_error"）。

  - `code: optional string or null`

    错误代码（如有）。

  - `event_id: optional string or null`

    导致错误的客户端事件的 event_id（如果适用）。

  - `param: optional string or null`

    与错误相关的参数（如有）。

### Realtime 错误事件

- `RealtimeErrorEvent object { error, event_id, type }`

  在发生错误时返回，错误可能来自客户端，也可能来自
  服务端。大多数错误都是可恢复的，会话将保持打开状态，我们
  建议实现者默认对错误消息进行监控和日志记录。

  - `error: RealtimeError`

    错误的详细信息。

    - `message: string`

      易于理解的错误消息。

    - `type: string`

      错误类型（例如 "invalid_request_error"、"server_error"）。

    - `code: optional string or null`

      错误代码（如有）。

    - `event_id: optional string or null`

      导致错误的客户端事件的 event_id（如果适用）。

    - `param: optional string or null`

      与错误相关的参数（如有）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "error"`

    事件类型，必须为 `error`.

    - `"error"`

### 实时函数工具

- `RealtimeFunctionTool object { description, name, parameters, type }`

  - `description: optional string`

    函数的描述，包括何时以及如何调用
    它的指引，以及在调用时应当向用户说明
    （的内容（如有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    采用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

### 实时 Mcp 审批请求

- `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

  一个请求人工批准工具调用的 Realtime 项目。

  - `id: string`

    该批准请求的唯一 ID。

  - `arguments: string`

    该工具的 JSON 字符串形式参数。

  - `name: string`

    要运行的工具名称。

  - `server_label: string`

    发起该请求的 MCP 服务器的标签。

  - `type: "mcp_approval_request"`

    条目的类型。始终 `mcp_approval_request`.

    - `"mcp_approval_request"`

### 实时 Mcp 审批响应

- `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

  响应 MCP 审批请求的实时项。

  - `id: string`

    审批响应的唯一 ID。

  - `approval_request_id: string`

    所回复的审批请求的 ID。

  - `approve: boolean`

    请求是否已批准。

  - `type: "mcp_approval_response"`

    条目的类型。始终 `mcp_approval_response`.

    - `"mcp_approval_response"`

  - `reason: optional string or null`

    可选的决策原因。

### 实时 Mcp 工具列表

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

      关于该工具的附加注解。

    - `description: optional string or null`

      工具的描述。

  - `type: "mcp_list_tools"`

    条目的类型。始终 `mcp_list_tools`.

    - `"mcp_list_tools"`

  - `id: optional string`

    该列表的唯一 ID。

### 实时 Mcp 协议错误

- `RealtimeMcpProtocolError object { code, message, type }`

  - `code: number`

  - `message: string`

  - `type: "protocol_error"`

    - `"protocol_error"`

### 实时 Mcp 工具调用

- `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

  表示对 MCP 服务器上工具进行调用的 Realtime item。

  - `id: string`

    工具调用的唯一 ID。

  - `arguments: string`

    传递给该工具的参数组成的 JSON 字符串。

  - `name: string`

    所运行工具的名称。

  - `server_label: string`

    运行该工具的 MCP 服务器的标签。

  - `type: "mcp_call"`

    条目的类型。始终 `mcp_call`.

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

### 实时 Mcp 工具执行错误

- `RealtimeMcpToolExecutionError object { message, type }`

  - `message: string`

  - `type: "tool_execution_error"`

    - `"tool_execution_error"`

### 实时 Mcp HTTP 错误

- `RealtimeMcphttpError object { code, message, type }`

  - `code: number`

  - `message: string`

  - `type: "http_error"`

    - `"http_error"`

### 实时推理

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

### 实时推理强度

- `RealtimeReasoningEffort = "minimal" or "low" or "medium" or 2 more`

  限制支持推理的 Realtime 模型（例如
  `gpt-realtime-2`.

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

### 实时响应

- `RealtimeResponse object { id, audio, conversation_id, 8 more }`

  响应资源。

  - `id: optional string`

    响应的唯一 ID，类似于 `resp_1234`.

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

        模型用于回应的语音。一旦模型至少用音频回应过一次，
        本次会话内的语音便不可更改。当前可用的
        语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的语音。一旦模型至少用音频回应过一次，
          本次会话内的语音便不可更改。当前可用的
          语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

    响应所加入的会话，由 `conversation`
    field in the `response.create` event. If `auto`, the response will be added to
    the default conversation and the value of `conversation_id` will be an id like
    `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有正在进行的响应，调用 `none`, the response will not be added to any conversation and
    the value of `conversation_id` 将为 `null`. If responses are being triggered
    automatically by VAD the response will be added to the default conversation

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    inclusive of tool calls, that was used in this response.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化
    格式存储有关对象的额外信息，并通过 API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终 `input_text` 用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        所回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终 `mcp_approval_response`.

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

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上工具进行调用的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数组成的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终 `mcp_call`.

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

      一个请求人工批准工具调用的 Realtime 项目。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的 JSON 字符串形式参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的取值为
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    输出设为 `text` 模式将禁用模型的音频输出。

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

      导致响应失败的错误说明，
      当 `status` 为 `failed`.

      - `code: optional string`

        错误代码（如有）。

      - `type: optional string`

        错误的类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      响应未完成的原因。对于 `cancelled` 响应，以下情况之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，以下情况之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被激活并中断了响应）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致响应失败的错误类型，与
      相对应的 `status` 字段（`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    响应的用量统计信息，将对应于计费。
    Realtime API会话将维护对话上下文并追加新的
    项到对话中，因此之前轮次的输出（文本和
    音频 token）将成为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      有关响应中所用输入 token 的详细信息。缓存 token 是对话中之前轮次的 token，会作为上下文包含在当前响应中。此处的缓存 token 计为输入 token 的子集，这意味着输入 token 包含缓存和未缓存的 token。

      - `audio_tokens: optional number`

        用作 Response 输入的音频 token 数量。

      - `cached_tokens: optional number`

        用作 Response 输入的已缓存 token 数量。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        用作 Response 输入的已缓存 token 的详细信息。

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

      Response 中使用的输出 token 的详细信息。

      - `audio_tokens: optional number`

        Response 中使用的音频 token 数量。

      - `text_tokens: optional number`

        Response 中使用的文本 token 数量。

    - `output_tokens: optional number`

      Response 中发送的输出 token 数量，包括文本和
      音频 token。

    - `total_tokens: optional number`

      Response 中包括输入和输出在内的 token 总数，
      包括文本和音频 token。

### 实时响应创建音频输出

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

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

      模型用于响应的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
      会话期间在模型至少响应过一次音频后更改。
      自定义声音必须由音频样本创建。
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

        自定义音色参考。

        - `id: string`

          自定义音色 ID，例如 `voice_1234`.

### 实时响应创建参数

- `RealtimeResponseCreateParams object { audio, conversation, input, 9 more }`

  使用这些参数创建一个新的 Realtime 响应。

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

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

        模型用于响应的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
        一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
        会话期间在模型至少响应过一次音频后更改。
        自定义声音必须由音频样本创建。
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

          自定义音色参考。

          - `id: string`

            自定义音色 ID，例如 `voice_1234`.

  - `conversation: optional string or "auto" or "none"`

    控制将响应添加到哪个对话。当前支持
    `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
    表示响应内容将添加到默认
    对话中。将此设置为 `none` 可创建带外响应，该响应
    不会向默认对话添加项。

    - `string`

    - `"auto" or "none"`

      控制将响应添加到哪个对话。当前支持
      `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
      表示响应内容将添加到默认
      对话中。将此设置为 `none` 可创建带外响应，该响应
      不会向默认对话添加项。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    要包含在模型提示词中的输入项。使用此字段
    会为此 Response 创建新上下文，而非使用默认
    对话。空数组 `[]` 将清除此 Response 的上下文。
    请注意，其中可能包含对此前会话中已出现项的引用
    并使用其 id。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终 `input_text` 用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        所回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终 `mcp_approval_response`.

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

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上工具进行调用的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数组成的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终 `mcp_call`.

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

      一个请求人工批准工具调用的 Realtime 项目。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的 JSON 字符串形式参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    预先添加到模型调用中的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可指示模型的响应内容和格式（例如“务必简洁”“表现友好”“以下是优秀响应的示例”），以及音频行为（例如“快速说话”“在声音中注入情感”“经常笑”）。模型不保证遵循这些指令，但这些指令为模型期望行为提供了指导。
    请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    其中包含工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
    默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化
    格式存储有关对象的额外信息，并通过 API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的取值为
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    输出设为 `text` 模式将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以在并行调用多个工具。仅由
    reasoning Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于在你的
      提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
      响应输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，固定为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

          输入项的类型，固定为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，固定为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

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

    模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（若有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以自行选择生成消息或调用一个或
      多个工具。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用指定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何调用
        它的指引，以及在调用时应当向用户说明
        （的内容（如有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        采用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

      - `type: "mcp"`

        MCP 工具的类型，始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

        允许使用的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
        服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
        授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
        `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持的 `connector_id` 取值包括：

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

        此 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的筛选对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。以下之一： `always` 或
          `never`。设置为 `always`，时，所有工具都需要审批。设置为
          设置为 `never`，时，所有工具均不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### 实时响应状态

- `RealtimeResponseStatus object { error, reason, type }`

  有关状态的更多详细信息。

  - `error: optional object { code, type }`

    导致响应失败的错误说明，
    当 `status` 为 `failed`.

    - `code: optional string`

      错误代码（如有）。

    - `type: optional string`

      错误的类型。

  - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

    响应未完成的原因。对于 `cancelled` 响应，以下情况之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，以下情况之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被激活并中断了响应）。

    - `"turn_detected"`

    - `"client_cancelled"`

    - `"max_output_tokens"`

    - `"content_filter"`

  - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

    导致响应失败的错误类型，与
    相对应的 `status` 字段（`completed`, `cancelled`, `incomplete`,
    `failed`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

### 实时响应用量

- `RealtimeResponseUsage object { input_token_details, input_tokens, output_token_details, 2 more }`

  响应的用量统计信息，将对应于计费。
  Realtime API会话将维护对话上下文并追加新的
  项到对话中，因此之前轮次的输出（文本和
  音频 token）将成为后续轮次的输入。

  - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

    有关响应中所用输入 token 的详细信息。缓存 token 是对话中之前轮次的 token，会作为上下文包含在当前响应中。此处的缓存 token 计为输入 token 的子集，这意味着输入 token 包含缓存和未缓存的 token。

    - `audio_tokens: optional number`

      用作 Response 输入的音频 token 数量。

    - `cached_tokens: optional number`

      用作 Response 输入的已缓存 token 数量。

    - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

      用作 Response 输入的已缓存 token 的详细信息。

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

    Response 中使用的输出 token 的详细信息。

    - `audio_tokens: optional number`

      Response 中使用的音频 token 数量。

    - `text_tokens: optional number`

      Response 中使用的文本 token 数量。

  - `output_tokens: optional number`

    Response 中发送的输出 token 数量，包括文本和
    音频 token。

  - `total_tokens: optional number`

    Response 中包括输入和输出在内的 token 总数，
    包括文本和音频 token。

### 实时响应用量输入令牌详情

- `RealtimeResponseUsageInputTokenDetails object { audio_tokens, cached_tokens, cached_tokens_details, 2 more }`

  有关响应中所用输入 token 的详细信息。缓存 token 是对话中之前轮次的 token，会作为上下文包含在当前响应中。此处的缓存 token 计为输入 token 的子集，这意味着输入 token 包含缓存和未缓存的 token。

  - `audio_tokens: optional number`

    用作 Response 输入的音频 token 数量。

  - `cached_tokens: optional number`

    用作 Response 输入的已缓存 token 数量。

  - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

    用作 Response 输入的已缓存 token 的详细信息。

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

### 实时响应用量输出令牌详情

- `RealtimeResponseUsageOutputTokenDetails object { audio_tokens, text_tokens }`

  Response 中使用的输出 token 的详细信息。

  - `audio_tokens: optional number`

    Response 中使用的音频 token 数量。

  - `text_tokens: optional number`

    Response 中使用的文本 token 数量。

### 实时服务器事件

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

    在创建会话项时返回。以下几种场景会产生该事件：

    - 服务端正在生成一个 Response，如果成功，它将生成
      一个或两个 Item，其类型为 `message`
      （role `assistant`）或类型 `function_call`.
    - 输入音频缓冲区已提交，由客户端或
      服务端（在 `server_vad` 模式下）提交。服务端将获取
      输入音频缓冲区的内容，并将其添加到一个新的用户消息 Item 中。
    - 客户端发送了 `conversation.item.create` 事件以向 Conversation 添加一个新 Item
      到会话中。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终 `input_text` 用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          所回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终 `mcp_approval_response`.

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

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上工具进行调用的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数组成的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终 `mcp_call`.

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

        一个请求人工批准工具调用的 Realtime 项目。

        - `id: string`

          该批准请求的唯一 ID。

        - `arguments: string`

          该工具的 JSON 字符串形式参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起该请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.created"`

      事件类型，必须为 `conversation.item.created`.

      - `"conversation.item.created"`

    - `previous_item_id: optional string or null`

      Conversation 上下文中前一个 Item 的 ID，便于
      客户端了解会话的顺序。可以是 `null` （如果该
      Item 没有前驱项）。

  - `ConversationItemDeletedEvent object { event_id, item_id, type }`

    当会话中的某个 item 由客户端通过以下方式删除时返回：
    `conversation.item.delete` event。此 event 用于将服务端对会话历史的理解与客户端的视图进行
    同步。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      已删除 item 的 ID。

    - `type: "conversation.item.deleted"`

      事件类型，必须为 `conversation.item.deleted`.

      - `"conversation.item.deleted"`

  - `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

    此事件是写入
    用户音频缓冲区的音频转录输出。当输入音频缓冲区由客户端或服务端提交时（启用 VAD 时），转录开始。转录
    由客户端或服务端提交（启用 VAD 时）时开始。转录
    与 Response 创建异步进行，因此此事件可能会出现在
    Response 事件之前或之后。

    Realtime API 模型原生支持音频，因此输入转录是
    单独的过程，在单独的 ASR（自动语音识别）模型上运行。
    转录文本可能与模型的理解略有出入，并且
    应视为大致参考。

    - `content_index: number`

      包含音频的内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      正在转录的音频所在条目的 ID。

    - `transcript: string`

      转录后的文本。

    - `type: "conversation.item.input_audio_transcription.completed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.completed`.

      - `"conversation.item.input_audio_transcription.completed"`

    - `usage: Tokens { input_tokens, output_tokens, total_tokens, 2 more }  or Duration { seconds, type }`

      本次转录的使用统计，按 ASR 模型的定价计费，而不是实时模型的定价。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按 token 使用量计费的模型的使用统计。

        - `input_tokens: number`

          本次请求计费的输入 token 数。

        - `output_tokens: number`

          生成的输出 token 数。

        - `total_tokens: number`

          使用的 token 总数（输入 + 输出）。

        - `type: "tokens"`

          使用对象的类型。始终为 `tokens` 。

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

          输入音频的时长（以秒为单位）。

        - `type: "duration"`

          使用对象的类型。始终为 `duration` 。

          - `"duration"`

    - `languages: optional array of TranscriptionLanguage`

      在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测出任何语言。

      - `code: string`

        在音频中检测到的语言代码。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。

      - `token: string`

        用于生成对数概率的 token。

      - `bytes: array of number`

        用于生成对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

    在输入音频转写内容部分的文本值通过增量转写结果被更新时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      正在转录的音频所在条目的 ID。

    - `type: "conversation.item.input_audio_transcription.delta"`

      事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

      - `"conversation.item.input_audio_transcription.delta"`

    - `content_index: optional number`

      条目内容数组中内容部分的索引。

    - `delta: optional string`

      文本增量。

    - `logprobs: optional array of LogProbProperties or null`

      转写的对数概率。可通过将会话配置为 `"include": ["item.input_audio_transcription.logprobs"]`。来启用。数组中的每个条目对应此转写片段可能被选中的某个 token 的对数概率。这有助于判断在给定的转写片段中是否存在多个有效选项。

      - `token: string`

        用于生成对数概率的 token。

      - `bytes: array of number`

        用于生成对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

    当配置了输入音频转录，且转录
    用户消息的请求失败时返回。这些事件与其他
    `error` 事件分开，以便客户端识别相关的 Item。

    - `content_index: number`

      包含音频的内容部分的索引。

    - `error: object { code, message, param, type }`

      转录错误的详细信息。

      - `code: optional string`

        错误代码（如有）。

      - `message: optional string`

        易于理解的错误消息。

      - `param: optional string`

        与错误相关的参数（如有）。

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

    在检索某个会话项时返回，用于 `conversation.item.retrieve`。提供该字段的目的是获取服务端对该项的表示，例如在降噪和 VAD 处理之后访问后处理后的音频数据。它包含该项的完整内容，包括音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.retrieved"`

      事件类型，必须为 `conversation.item.retrieved`.

      - `"conversation.item.retrieved"`

  - `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

    当客户端通过
    以下事件截断此前的助手音频消息项时返回： `conversation.item.truncate` 此事件用于
    将服务端对音频的理解与客户端的播放保持同步。

    此操作会截断音频并移除服务端文本转录，
    以确保上下文中没有用户尚未听到的文本。

    - `audio_end_ms: number`

      音频被截断的时长上限，单位为毫秒。

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

    在发生错误时返回，错误可能来自客户端，也可能来自
    服务端。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认对错误消息进行监控和日志记录。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        易于理解的错误消息。

      - `type: string`

        错误类型（例如 "invalid_request_error"、"server_error"）。

      - `code: optional string or null`

        错误代码（如有）。

      - `event_id: optional string or null`

        导致错误的客户端事件的 event_id（如果适用）。

      - `param: optional string or null`

        与错误相关的参数（如有）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `InputAudioBufferClearedEvent object { event_id, type }`

    当客户端使用以下方式清除输入音频缓冲区时返回
    `input_audio_buffer.clear` 事件时。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "input_audio_buffer.cleared"`

      事件类型，必须为 `input_audio_buffer.cleared`.

      - `"input_audio_buffer.cleared"`

  - `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

    在输入音频缓冲区被提交时返回，无论是客户端提交还是在
    服务端 VAD 模式下自动提交。此处 `item_id` 属性是用户消息项的
    ID，因此会同时向客户端发送一条 `conversation.item.created` 事件
    。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将要创建的用户消息项的 ID。

    - `type: "input_audio_buffer.committed"`

      事件类型，必须为 `input_audio_buffer.committed`.

      - `"input_audio_buffer.committed"`

    - `previous_item_id: optional string or null`

      新项将插入到该前置项之后，该前置项的 ID。
      如果该项没有前置项，则可以为 `null` 。

  - `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

    **仅 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示电话键盘按键（0–9、*、#、A–D）的消息。
    属性为用户按下的键盘按键。 `event` 属性
    为用户按下的键盘按键。 `received_at` 是服务端收到事件的 UTC Unix 时间戳。
    表示服务端收到该事件的时间。

    - `event: string`

      用户按下的电话键盘按键。

    - `received_at: number`

      服务端收到 DTMF 事件时的 UTC Unix 时间戳。

    - `type: "input_audio_buffer.dtmf_event_received"`

      事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

      - `"input_audio_buffer.dtmf_event_received"`

  - `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

    由服务端在 `server_vad` 模式下发送，提示已在音频缓冲区中检测到语音。
    检测到语音。只要有音频被添加进缓冲区就可能发生此事件
    （除非已经处于语音检测状态）。客户端可使用此事件
    来打断音频播放，或向用户提供视觉反馈。

    客户端应预期在语音停止时收到 `input_audio_buffer.speech_stopped` 事件
    语音停止事件。该 `item_id` 属性是将在语音停止时创建的用户消息项的 ID，该 ID
    也会出现在随后的语音停止事件中（除非客户端在 VAD 激活期间
    `input_audio_buffer.speech_stopped` 事件中手动提交音频缓冲区
    ）。

    - `audio_start_ms: number`

      从会话期间首次检测到语音时起，所有写入缓冲区
      的音频起始处算起的毫秒数。该时间对应于发送给
      模型的音频开头，因此包含在 Session 中配置的
      `prefix_padding_ms` 。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      语音停止时将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_started"`

      事件类型，必须为 `input_audio_buffer.speech_started`.

      - `"input_audio_buffer.speech_started"`

  - `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

    返回于 `server_vad` 模式，当服务器检测到
    音频缓冲区中的语音结束时。服务器还会发送一个 `conversation.item.created`
    事件，其中包含根据音频缓冲区创建的用户消息项。

    - `audio_end_ms: number`

      语音停止时距会话开始所经过的毫秒数。这将
      对应于发送给模型的音频结束时间，因此包含
      `min_silence_duration_ms` 。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将要创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_stopped"`

      事件类型，必须为 `input_audio_buffer.speech_stopped`.

      - `"input_audio_buffer.speech_stopped"`

  - `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

    在 Response 开始时发出，用于指示更新后的速率限制。
    创建 Response 时，部分 token 将被“预留”用于输出
    token，此处显示的速率限制反映了该预留，并在
    Response 完成后进行相应调整。

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

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.delta"`

      事件类型，必须为 `response.output_audio.delta`.

      - `"response.output_audio.delta"`

  - `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

    当模型生成的音频完成时返回。在 Response
    被中断、未完成或取消时也会发出。

    - `content_index: number`

      条目内容数组中内容部分的索引。

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

    当模型对音频输出生成的转写更新时返回。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `delta: string`

      转写文本增量。

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

    当模型对音频输出生成的转写完成时返回流
    式结果。在 Response 被中断、未完成或
    取消时也会发出。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `transcript: string`

      该音频的最终转写文本。

    - `type: "response.output_audio_transcript.done"`

      事件类型，必须为 `response.output_audio_transcript.done`.

      - `"response.output_audio_transcript.done"`

  - `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

    在响应生成过程中，当新的内容部分被添加
    到助手消息项时返回。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      被添加内容部分的项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `part: object { audio, text, transcript, type }`

      被添加的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果类型为 "audio"）。

      - `text: optional string`

        文本内容（如果类型为 "text"）。

      - `transcript: optional string`

        音频的转录文本（如果类型为 "audio"）。

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
    当 Response 被中断、不完整或取消时，也会发出此事件。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `part: object { audio, text, transcript, type }`

      已完成的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果类型为 "audio"）。

      - `text: optional string`

        文本内容（如果类型为 "text"）。

      - `transcript: optional string`

        音频的转录文本（如果类型为 "audio"）。

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

    创建新的 Response 时返回。这是创建响应的第一个事件，
    此时响应处于初始状态 `in_progress`.

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

      - `id: optional string`

        响应的唯一 ID，类似于 `resp_1234`.

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

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            本次会话内的语音便不可更改。当前可用的
            语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回应的语音。一旦模型至少用音频回应过一次，
              本次会话内的语音便不可更改。当前可用的
              语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

        响应所加入的会话，由 `conversation`
        field in the `response.create` event. If `auto`, the response will be added to
        the default conversation and the value of `conversation_id` will be an id like
        `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有正在进行的响应，调用 `none`, the response will not be added to any conversation and
        the value of `conversation_id` 将为 `null`. If responses are being triggered
        automatically by VAD the response will be added to the default conversation

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        inclusive of tool calls, that was used in this response.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        一组 16 个键值对，可附加到对象上。这可以
        用于以结构化
        格式存储有关对象的额外信息，并通过 API 或控制面板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        ，最大长度为 512 个字符。

      - `object: optional "realtime.response"`

        对象类型，必须为 `realtime.response`.

        - `"realtime.response"`

      - `output: optional array of ConversationItem`

        响应生成的输出项列表。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          实时对话中的助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          实时对话中的函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          实时对话中的函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的实时项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          用于列出 MCP 服务器上可用工具的 Realtime item。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          表示对 MCP 服务器上工具进行调用的 Realtime item。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          一个请求人工批准工具调用的 Realtime 项目。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前唯一可能的取值为
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        输出设为 `text` 模式将禁用模型的音频输出。

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

          导致响应失败的错误说明，
          当 `status` 为 `failed`.

          - `code: optional string`

            错误代码（如有）。

          - `type: optional string`

            错误的类型。

        - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

          响应未完成的原因。对于 `cancelled` 响应，以下情况之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，以下情况之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被激活并中断了响应）。

          - `"turn_detected"`

          - `"client_cancelled"`

          - `"max_output_tokens"`

          - `"content_filter"`

        - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

          导致响应失败的错误类型，与
          相对应的 `status` 字段（`completed`, `cancelled`, `incomplete`,
          `failed`).

          - `"completed"`

          - `"cancelled"`

          - `"failed"`

          - `"incomplete"`

      - `usage: optional RealtimeResponseUsage`

        响应的用量统计信息，将对应于计费。
        Realtime API会话将维护对话上下文并追加新的
        项到对话中，因此之前轮次的输出（文本和
        音频 token）将成为后续轮次的输入。

        - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

          有关响应中所用输入 token 的详细信息。缓存 token 是对话中之前轮次的 token，会作为上下文包含在当前响应中。此处的缓存 token 计为输入 token 的子集，这意味着输入 token 包含缓存和未缓存的 token。

          - `audio_tokens: optional number`

            用作 Response 输入的音频 token 数量。

          - `cached_tokens: optional number`

            用作 Response 输入的已缓存 token 数量。

          - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

            用作 Response 输入的已缓存 token 的详细信息。

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

          Response 中使用的输出 token 的详细信息。

          - `audio_tokens: optional number`

            Response 中使用的音频 token 数量。

          - `text_tokens: optional number`

            Response 中使用的文本 token 数量。

        - `output_tokens: optional number`

          Response 中发送的输出 token 数量，包括文本和
          音频 token。

        - `total_tokens: optional number`

          Response 中包括输入和输出在内的 token 总数，
          包括文本和音频 token。

    - `type: "response.created"`

      事件类型，必须为 `response.created`.

      - `"response.created"`

  - `ResponseDoneEvent object { event_id, response, type }`

    当 Response 完成流式传输时返回。无论何种情况都会发出，
    final state。事件中包含的 Response 对象将处于 `response.done` event will
    包含 Response 中的所有输出 Items，但会省略原始音频数据。

    客户端应检查 Response 的 `status` 字段，以判断响应是否成功
    (`completed`) 还是出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

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

    当模型生成的函数调用参数被更新时返回。

    - `call_id: string`

      函数调用的 ID。

    - `delta: string`

      以 JSON 字符串形式表示的参数增量。

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

    在模型生成的函数调用参数流式传输完成时返回。
    当 Response 被中断、不完整或取消时，也会发出此事件。

    - `arguments: string`

      最终参数，形式为 JSON 字符串。

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

    在 Response 生成期间创建新的 Item 时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      输出项在 Response 中的索引。

    - `response_id: string`

      该 Item 所属 Response 的 ID。

    - `type: "response.output_item.added"`

      事件类型，必须为 `response.output_item.added`.

      - `"response.output_item.added"`

  - `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

    在 Item 流式传输完成时返回。也会在 Response 被
    中断、未完成或被取消时发出。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      输出项在 Response 中的索引。

    - `response_id: string`

      该 Item 所属 Response 的 ID。

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

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_text.delta"`

      事件类型，必须为 `response.output_text.delta`.

      - `"response.output_text.delta"`

  - `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

    在 "output_text" 内容部分的文本值流式传输完成时返回。也会
    在 Response 被中断、未完成或被取消时发出。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `text: string`

      最终文本内容。

    - `type: "response.output_text.done"`

      事件类型，必须为 `response.output_text.done`.

      - `"response.output_text.done"`

  - `SessionCreatedEvent object { event_id, session, type }`

    在创建 Session 时返回。新连接建立时会自动作为第一个
    服务端事件发出。该事件将包含默认的 Session 配置。
    该默认 Session 配置。

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

          要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

          - `"realtime"`

        - `audio: optional object { input, output }`

          输入和输出音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }  or null`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional object { language, languages, model, prompt }  or null`

              输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

              - `language: optional string or null`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                为输入音频转录配置的提示词（如果提供）。

            - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

              轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，到时后将自动触发模型响应。这在
                  用户长时间停顿出乎意料的场景下非常有用，例如电话
                  通话。模型将有效地基于当前上下文提示用户继续对话。
                  在当前上下文下，提示用户继续对话。

                  超时值将在上一次模型响应的音频播放完毕后开始计算，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 关联的)将在达到超时时间时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否自动中断（取消）默认
                  会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
                  毫秒）。默认为 300 毫秒。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
                  为 500 毫秒。该值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更响亮的音频才能激活模型，
                  因此在嘈杂环境下可能会有更好的表现。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD 停止事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当默认设备产生输出时，是否自动中断任何正在进行的响应
                  会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

          - `output: optional object { format, speed, voice }`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音响应的速度，是原始速度的倍数。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

              此参数是对生成后音频的后处理调整，
              也可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

              模型用于回应的语音。一旦模型至少用音频回应过一次，
              本次会话内的语音便不可更改。当前可用的
              语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
              最佳质量。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                模型用于回应的语音。一旦模型至少用音频回应过一次，
                本次会话内的语音便不可更改。当前可用的
                语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
                `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

          `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

          请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          其中包含工具调用。提供 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
          默认为 `inf`.

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

          模型可以回复的模态集合。默认值为 `["audio"]`，表示
          使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
          模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

          - `id: string`

            要使用的提示模板的唯一标识符。

          - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

            用于在你的
            提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
            响应输入类型，例如图片或文件。

            - `string`

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

              - `text: string`

                发送给模型的文本输入。

              - `type: "input_text"`

                输入项的类型，固定为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

                输入项的类型，固定为 `input_image`.

                - `"input_image"`

              - `file_id: optional string or null`

                发送给模型的文件 ID。

              - `image_url: optional string or null`

                发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型，固定为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

                标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

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

          模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪个工具（若有）。

            `none` 表示模型将不调用任何工具，而是生成一条消息。

            `auto` 表示模型可以自行选择生成消息或调用一个或
            多个工具。

            `required` 表示模型必须调用一个或多个工具。

            - `"none"`

            - `"auto"`

            - `"required"`

          - `ToolChoiceFunction object { name, type }`

            使用此选项可强制模型调用指定的函数。

            - `name: string`

              要调用的函数名称。

            - `type: "function"`

              对于函数调用，类型始终为 `function`.

              - `"function"`

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

            - `server_label: string`

              要使用的 MCP 服务器的标签。

            - `type: "mcp"`

              对于 MCP 工具，类型始终为 `mcp`.

              - `"mcp"`

            - `name: optional string or null`

              要在服务器上调用的工具名称。

        - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

            - `description: optional string`

              函数的描述，包括何时以及如何调用
              它的指引，以及在调用时应当向用户说明
              （的内容（如有）。

            - `name: optional string`

              函数的名称。

            - `parameters: optional unknown`

              采用 JSON Schema 表示的函数参数。

            - `type: optional "function"`

              工具的类型，即 `function`.

              - `"function"`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
            (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中识别它。

            - `type: "mcp"`

              MCP 工具的类型，始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
              服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
              授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
              `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
              通过安全 MCP 隧道进行连接。

              当前支持的 `connector_id` 取值包括：

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

              此 MCP 工具是否为延迟加载，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的筛选对象
                ，这些工具需要审批。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                    MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    进行了标注，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                    MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    进行了标注，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。以下之一： `always` 或
                `never`。设置为 `always`，时，所有工具都需要审批。设置为
                设置为 `never`，时，所有工具均不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
              `tunnel_id` 必须提供。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

          Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
          为会话启用追踪，便无法修改配置。

          `auto` 将使用以下默认值为此会话创建追踪：
          工作流名称、组 ID 和元数据。

          - `Auto = "auto"`

            启用追踪并设置追踪配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            用于追踪的精细配置。

            - `group_id: optional string`

              附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
              分组。

            - `metadata: optional unknown`

              附加到此追踪的任意元数据，用于启用
              Traces Dashboard 中的筛选。

            - `workflow_name: optional string`

              附加到此追踪的工作流名称。用于在 Traces Dashboard 中
              为此追踪命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

          客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

          截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

          可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

          - `"auto" or "disabled"`

            本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

            - `retention_ratio: number`

              超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

            - `type: "retention_ratio"`

              使用按比例保留的截断方式。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

              - `post_instructions: optional number`

                指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        实时转录会话配置对象。

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

                降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `transcription: optional object { language, languages, model, prompt }  or null`

              转录模型的配置。

              - `language: optional string or null`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                为输入音频转录配置的提示词（如果提供）。

            - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

              轮次检测的配置。可以设置为 `null` 以关闭。服务端
              VAD 意味着模型将根据
              音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此值必须为 `null`；不支持 VAD。

              - `prefix_padding_ms: optional number`

                在 VAD 检测到语音之前包含的音频量（单位为
                毫秒）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                用于检测语音停止的静默时长（单位为毫秒）。默认
                为 500 毫秒。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                高的阈值需要更响亮的音频才能激活模型，
                因此在嘈杂环境下可能会有更好的表现。

              - `type: optional string`

                轮次检测的类型，仅 `server_vad` 目前受支持。

        - `expires_at: optional number`

          会话的过期时间戳，以自 Unix 纪元起的秒数表示。

        - `include: optional array of "item.input_audio_transcription.logprobs" or null`

          要在服务端输出中包含的额外字段。

          - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `SessionUpdatedEvent object { event_id, session, type }`

    当会话使用 `session.update` 事件更新时返回，除非
    发生错误。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

      会话配置。

      - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

        Realtime 会话配置对象。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        实时转录会话配置对象。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `OutputAudioBufferStarted object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务器开始向客户端流式传输音频时发出。该事件在音频内容部分被添加（
    到响应中）之后（`response.content_part.added`)
    发出。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.started"`

      事件类型，必须为 `output_audio_buffer.started`.

      - `"output_audio_buffer.started"`

  - `OutputAudioBufferStopped object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务器上的输出音频缓冲区已被完全耗尽，
    且不会再有音频传输时发出。该事件在完整的响应
    数据已发送到客户端后发出（`response.done`).
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.stopped"`

      事件类型，必须为 `output_audio_buffer.stopped`.

      - `"output_audio_buffer.stopped"`

  - `OutputAudioBufferCleared object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当输出音频缓冲区被清空时发出。这可能发生在 VAD
    模式下用户中断时（`input_audio_buffer.speech_started`),
    或客户端发出 `output_audio_buffer.clear` 事件以手动
    中断当前音频响应时。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.cleared"`

      事件类型，必须为 `output_audio_buffer.cleared`.

      - `"output_audio_buffer.cleared"`

  - `ConversationItemAdded object { event_id, item, type, previous_item_id }`

    当一个 Item 被添加到默认会话时由服务端发送。可能出现在以下几种情况：

    - 当客户端发送 `conversation.item.create` 事件时。
    - 当输入音频缓冲区被提交时。在这种情况下，该 item 将是一条用户消息，其中包含缓冲区中的音频。
    - 当模型正在生成 Response 时。在这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它此时尚不包含任何内容（且 `status` 将为 `in_progress`).

    该事件将包含 Item 的完整内容（模型正在生成 Response 时除外），但音频数据除外，音频数据可以在需要时通过单独的 `conversation.item.retrieve` 事件获取。

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

    在对话条目完成时返回。

    该事件将包含 Item 的完整内容，但音频数据除外，音频数据可在需要时通过以下方式单独检索： `conversation.item.retrieve` 事件（如有需要）。

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

    当输入音频缓冲区触发 Server VAD 超时时返回。该配置在会话的设置中完成，表示在配置的时长内未检测到任何语音。
    在 `idle_timeout_ms` 会话的 `turn_detection` 设置中配置，表示在配置的时长内未检测到任何语音。
    在配置的时长内未检测到任何语音。

    该 `audio_start_ms` 和 `audio_end_ms` 字段表示从最后一次模型响应之后到触发时刻之间的音频片段，以写入输入音频缓冲区的起始时间为偏移量。这意味着它划定了那段静默的音频区间，且起始值与结束值之间的差值大致等于所配置的超时时长。
    模型响应之后到触发时刻的音频片段，作为距写入输入音频缓冲区起始处的偏移量。
    这意味着它划定了静默的音频片段，且
    起始值和结束值之间的差值大致等于所配置的超时时长。

    空音频将作为一项（item）提交到对话中（将产生 `input_audio` 一个 item 事件），并将生成模型响应。可能存在一些语音未触发 VAD 但仍被模型检测到的情况，因此模型可能会
    `input_audio_buffer.committed` 事件），并将生成一个模型响应。可能存在一些语音
    未触发 VAD，但仍然被模型检测到，因此模型可能会以与对话相关的内容或继续说话的提示进行回复。
    做出与对话相关的内容或继续说话的提示。

    - `audio_end_ms: number`

      触发超时时写入输入音频缓冲区的音频的毫秒偏移量。

    - `audio_start_ms: number`

      在最后一次模型响应的播放时间之后，写入输入音频缓冲区的音频的毫秒偏移量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      与此片段关联的 item 的 ID。

    - `type: "input_audio_buffer.timeout_triggered"`

      事件类型，必须为 `input_audio_buffer.timeout_triggered`.

      - `"input_audio_buffer.timeout_triggered"`

  - `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

    当某个条目识别出输入音频转写片段时返回。

    - `id: string`

      片段标识符。

    - `content_index: number`

      条目中输入音频内容部分的索引。

    - `end: number`

      片段的结束时间（以秒为单位）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      包含输入音频内容的条目 ID。

    - `speaker: string`

      此片段检测到的说话人标签。

    - `start: number`

      片段的开始时间（以秒为单位）。

    - `text: string`

      此片段的文本。

    - `type: "conversation.item.input_audio_transcription.segment"`

      事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

      - `"conversation.item.input_audio_transcription.segment"`

  - `McpListToolsInProgress object { event_id, item_id, type }`

    在某个项目的 MCP 工具列举进行中时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具条目的 ID。

    - `type: "mcp_list_tools.in_progress"`

      事件类型，必须为 `mcp_list_tools.in_progress`.

      - `"mcp_list_tools.in_progress"`

  - `McpListToolsCompleted object { event_id, item_id, type }`

    当列出 MCP 工具针对某个条目完成时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具条目的 ID。

    - `type: "mcp_list_tools.completed"`

      事件类型，必须为 `mcp_list_tools.completed`.

      - `"mcp_list_tools.completed"`

  - `McpListToolsFailed object { event_id, item_id, type }`

    在列出某个项目的 MCP 工具失败时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具条目的 ID。

    - `type: "mcp_list_tools.failed"`

      事件类型，必须为 `mcp_list_tools.failed`.

      - `"mcp_list_tools.failed"`

  - `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

    当响应生成期间 MCP 工具调用参数被更新时返回。

    - `delta: string`

      经过 JSON 编码的参数增量。

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

      如果存在，则表示增量文本已进行混淆处理。

  - `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

    在响应生成过程中 MCP 工具调用参数确定时返回。

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

  beta 接口的实时会话对象。

  - `id: optional string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `expires_at: optional number`

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`,输入音频必须为 16 位 PCM,采样率 24kHz,
    单声道(mono),并采用小端字节序。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `input_audio_noise_reduction: optional object { type }`

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `input_audio_transcription: optional object { language, languages, model, prompt }  or null`

    输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

    - `language: optional string or null`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      为输入音频转录配置的提示词（如果提供）。

  - `instructions: optional string`

    默认系统指令(即系统消息),会添加到模型调用之前。
    此字段允许客户端引导模型生成所需的
    回复。可以指示模型的回复内容和格式,
    (例如 "be extremely succinct"、"act friendly"、"here are examples of good
    responses")以及音频行为(例如 "talk quickly"、"inject emotion
    into your voice"、"laugh frequently")。这些指令不保证
    被模型严格遵循,但它们会为模型的期望行为提供引导。
    期望行为提供指导。

    注意,服务端会设置默认指令,当此字段
    未设置时会使用默认指令,且默认指令可在 `session.created` event 中查看,该事件出现在
    会话开始时。

  - `max_response_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    其中包含工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
    默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `modalities: optional array of "text" or "audio"`

    模型可用于回复的模态集合。若要禁用音频,
    可将其设置为 ["text"]。

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

      用于在你的
      提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
      响应输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，固定为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

          输入项的类型，固定为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，固定为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `speed: optional number`

    模型语音回复的速度。1.0 是默认速度。0.25 是最低速度。
    1.5 是最高速度。该值只能在模型轮次之间更改，不能在回复进行中更改。
    in between model turns, not while a response is in progress.

  - `temperature: optional number`

    模型的采样 temperature，限制为 [0.6, 1.2]。对于音频模型，强烈建议使用 0.8 的 temperature 以获得最佳性能。

  - `tool_choice: optional string`

    模型选择工具的方式。选项包括 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    可供模型使用的工具（函数）。

    - `description: optional string`

      函数的描述，包括何时以及如何调用
      它的指引，以及在调用时应当向用户说明
      （的内容（如有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      采用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

    追踪的配置选项。设置为 null 以禁用追踪。一旦
    为会话启用追踪，便无法修改配置。

    `auto` 将使用以下默认值为此会话创建追踪：
    工作流名称、组 ID 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      用于追踪的精细配置。

      - `group_id: optional string`

        附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
        在追踪仪表板中进行分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于启用
        在追踪仪表板中进行筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。用于在 Traces Dashboard 中
        在追踪仪表板中为追踪命名。

  - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

    轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，到时后将自动触发模型响应。这在
        用户长时间停顿出乎意料的场景下非常有用，例如电话
        通话。模型将有效地基于当前上下文提示用户继续对话。
        在当前上下文下，提示用户继续对话。

        超时值将在上一次模型响应的音频播放完毕后开始计算，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 关联的)将在达到超时时间时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否自动中断（取消）默认
        会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
        毫秒）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
        为 500 毫秒。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更响亮的音频才能激活模型，
        因此在嘈杂环境下可能会有更好的表现。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD 停止事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当默认设备产生输出时，是否自动中断任何正在进行的响应
        会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

    模型用于回应的语音。一旦模型至少用音频回应过一次，
    本次会话内的语音便不可更改。当前可用的
    语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
    `shimmer`，以及 `verse`.

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      模型用于回应的语音。一旦模型至少用音频回应过一次，
      本次会话内的语音便不可更改。当前可用的
      语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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
        降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转写文本之前等待多长时间。
          较高的值可以提高转写准确度，但会增加延迟。
          仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在以下字段中提供输入语言：
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          可提高准确度并降低延迟。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          可选的文本，用于引导模型风格或延续之前的音频
          片段。
          对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
          Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

      - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

        轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，到时后将自动触发模型响应。这在
            用户长时间停顿出乎意料的场景下非常有用，例如电话
            通话。模型将有效地基于当前上下文提示用户继续对话。
            在当前上下文下，提示用户继续对话。

            超时值将在上一次模型响应的音频播放完毕后开始计算，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 关联的)将在达到超时时间时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否自动中断（取消）默认
            会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
            毫秒）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
            为 500 毫秒。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更响亮的音频才能激活模型，
            因此在嘈杂环境下可能会有更好的表现。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD 停止事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当默认设备产生输出时，是否自动中断任何正在进行的响应
            会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

    - `output: optional RealtimeAudioConfigOutput`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音响应的速度，是原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

        此参数是对生成后音频的后处理调整，
        也可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

        模型用于响应的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
        一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
        会话期间在模型至少响应过一次音频后更改。
        自定义声音必须由音频样本创建。
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

          自定义音色参考。

          - `id: string`

            自定义音色 ID，例如 `voice_1234`.

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

    请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    其中包含工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
    默认为 `inf`.

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

    模型可以回复的模态集合。默认值为 `["audio"]`，表示
    使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
    模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以在并行调用多个工具。仅由
    reasoning Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于在你的
      提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
      响应输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，固定为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

          输入项的类型，固定为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，固定为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

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

    模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（若有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以自行选择生成消息或调用一个或
      多个工具。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用指定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

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

        函数的描述，包括何时以及如何调用
        它的指引，以及在调用时应当向用户说明
        （的内容（如有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        采用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

      - `type: "mcp"`

        MCP 工具的类型，始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

        允许使用的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
        服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
        授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
        `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持的 `connector_id` 取值包括：

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

        此 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的筛选对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。以下之一： `always` 或
          `never`。设置为 `always`，时，所有工具都需要审批。设置为
          设置为 `never`，时，所有工具均不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `tracing: optional RealtimeTracingConfig or null`

    Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
    为会话启用追踪，便无法修改配置。

    `auto` 将使用以下默认值为此会话创建追踪：
    工作流名称、组 ID 和元数据。

    - `Auto = "auto"`

      启用追踪并设置追踪配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      用于追踪的精细配置。

      - `group_id: optional string`

        附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
        分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于启用
        Traces Dashboard 中的筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。用于在 Traces Dashboard 中
        为此追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

    客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

    截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

    可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

    - `"auto" or "disabled"`

      本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

      - `retention_ratio: number`

        超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用按比例保留的截断方式。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

        - `post_instructions: optional number`

          指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Tool Choice Config

- `RealtimeToolChoiceConfig = ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

  模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（若有）。

    `none` 表示模型将不调用任何工具，而是生成一条消息。

    `auto` 表示模型可以自行选择生成消息或调用一个或
    多个工具。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用指定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

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

      函数的描述，包括何时以及如何调用
      它的指引，以及在调用时应当向用户说明
      （的内容（如有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      采用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

    - `type: "mcp"`

      MCP 工具的类型，始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许使用的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
          MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          进行了标注，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
      服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
      授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
      `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持的 `connector_id` 取值包括：

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

      此 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的筛选对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。以下之一： `always` 或
        `never`。设置为 `always`，时，所有工具都需要审批。设置为
        设置为 `never`，时，所有工具均不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Realtime Tools Config Union

- `RealtimeToolsConfigUnion = RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

  通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
  (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何调用
      它的指引，以及在调用时应当向用户说明
      （的内容（如有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      采用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

    - `type: "mcp"`

      MCP 工具的类型，始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许使用的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
          MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          进行了标注，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
      服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
      授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
      `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持的 `connector_id` 取值包括：

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

      此 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的筛选对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。以下之一： `always` 或
        `never`。设置为 `always`，时，所有工具都需要审批。设置为
        设置为 `never`，时，所有工具均不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Realtime 追踪 Config

- `RealtimeTracingConfig = "auto" or TracingConfiguration { group_id, metadata, workflow_name }`

  Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
  为会话启用追踪，便无法修改配置。

  `auto` 将使用以下默认值为此会话创建追踪：
  工作流名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    用于追踪的精细配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于启用
      Traces Dashboard 中的筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。用于在 Traces Dashboard 中
      为此追踪命名。

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
      降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待多长时间。
        较高的值可以提高转写准确度，但会增加延迟。
        仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在以下字段中提供输入语言：
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可提高准确度并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于引导模型风格或延续之前的音频
        片段。
        对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

      轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，到时后将自动触发模型响应。这在
          用户长时间停顿出乎意料的场景下非常有用，例如电话
          通话。模型将有效地基于当前上下文提示用户继续对话。
          在当前上下文下，提示用户继续对话。

          超时值将在上一次模型响应的音频播放完毕后开始计算，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 关联的)将在达到超时时间时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否自动中断（取消）默认
          会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
          毫秒）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
          为 500 毫秒。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更响亮的音频才能激活模型，
          因此在嘈杂环境下可能会有更好的表现。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD 停止事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当默认设备产生输出时，是否自动中断任何正在进行的响应
          会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

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
    降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转写文本之前等待多长时间。
      较高的值可以提高转写准确度，但会增加延迟。
      仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在以下字段中提供输入语言：
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      可提高准确度并降低延迟。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      可选的文本，用于引导模型风格或延续之前的音频
      片段。
      对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
      Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

  - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

    轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，到时后将自动触发模型响应。这在
        用户长时间停顿出乎意料的场景下非常有用，例如电话
        通话。模型将有效地基于当前上下文提示用户继续对话。
        在当前上下文下，提示用户继续对话。

        超时值将在上一次模型响应的音频播放完毕后开始计算，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 关联的)将在达到超时时间时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否自动中断（取消）默认
        会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
        毫秒）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
        为 500 毫秒。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更响亮的音频才能激活模型，
        因此在嘈杂环境下可能会有更好的表现。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD 停止事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当默认设备产生输出时，是否自动中断任何正在进行的响应
        会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

### Realtime Transcription Session Audio Input Turn Detection

- `RealtimeTranscriptionSessionAudioInputTurnDetection = ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，到时后将自动触发模型响应。这在
      用户长时间停顿出乎意料的场景下非常有用，例如电话
      通话。模型将有效地基于当前上下文提示用户继续对话。
      在当前上下文下，提示用户继续对话。

      超时值将在上一次模型响应的音频播放完毕后开始计算，
      即设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      与 Response 关联的)将在达到超时时间时发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD 开始事件发生时，是否自动中断（取消）默认
      会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
      毫秒）。默认为 300 毫秒。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
      为 500 毫秒。该值越小，模型响应越快，
      但可能会在用户短暂的停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
      高的阈值需要更响亮的音频才能激活模型，
      因此在嘈杂环境下可能会有更好的表现。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD 停止事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当默认设备产生输出时，是否自动中断任何正在进行的响应
      会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

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
        降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转写文本之前等待多长时间。
          较高的值可以提高转写准确度，但会增加延迟。
          仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在以下字段中提供输入语言：
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          可提高准确度并降低延迟。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          可选的文本，用于引导模型风格或延续之前的音频
          片段。
          对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
          Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

      - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

        轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，到时后将自动触发模型响应。这在
            用户长时间停顿出乎意料的场景下非常有用，例如电话
            通话。模型将有效地基于当前上下文提示用户继续对话。
            在当前上下文下，提示用户继续对话。

            超时值将在上一次模型响应的音频播放完毕后开始计算，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 关联的)将在达到超时时间时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否自动中断（取消）默认
            会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
            毫秒）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
            为 500 毫秒。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更响亮的音频才能激活模型，
            因此在嘈杂环境下可能会有更好的表现。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD 停止事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当默认设备产生输出时，是否自动中断任何正在进行的响应
            会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Translation Client Event

- `RealtimeTranslationClientEvent = RealtimeTranslationSessionUpdateEvent or RealtimeTranslationInputAudioBufferAppendEvent or RealtimeTranslationSessionCloseEvent`

  Realtime 翻译客户端事件。

  - `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新翻译会话配置。翻译
    会话支持更新 `audio.output.language`, `audio.input.transcription`,
    和 `audio.input.noise_reduction`.

    - `session: RealtimeTranslationSessionUpdateRequest`

      要更新的翻译会话字段。会话 `type` 和 `model` 已设置
      在创建时，无法通过 `session.update`.

      - `audio: optional object { input, output }`

        翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。设置为 `null` 以禁用。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转写。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍从
            输入音频流运行。

            - `model: string`

              用于源转写文本增量的转写模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转写文本增量的目标语言。

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到翻译会话输入音频缓冲区。

    WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
    小端序原始音频字节。不受支持的 WebSocket 音频格式会返回
    验证错误，因为低质量音频会显著降低翻译
    质量。

    翻译以 200 ms 的引擎帧为处理单位。为获得最佳实时效果，请追加
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

      用于标识此事件的可选客户端生成 ID。

  - `RealtimeTranslationSessionCloseEvent object { type, event_id }`

    Gracefully close the realtime translation session. The server flushes pending
    input audio and emits any remaining translated output before closing the
    session.

    - `type: "session.close"`

      事件类型，必须为 `session.close`.

      - `"session.close"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

### Realtime Translation Client Secret Create Request

- `RealtimeTranslationClientSecretCreateRequest object { session, expires_after }`

  为 Realtime API 创建翻译会话和客户端密钥。

  - `session: RealtimeTranslationSessionCreateRequest`

    Realtime 翻译会话配置。翻译会话会持续地流式传入源
    音频，并以增量方式流式输出翻译后的音频和转录文本。

    - `model: string`

      此会话使用的 Realtime 翻译模型。

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转写。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转写文本增量的转写模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转写文本增量的目标语言。

  - `expires_after: optional object { anchor, seconds }`

    客户端密钥过期配置。过期时间指的是客户端密钥不再可用于创建会话的时刻。会话本身在
    启动后可以在该时间之后继续。一个密钥在过期之前可用于创建多个会话，
    直到过期为止。
    直到过期为止。

    - `anchor: optional "created_at"`

      客户端密钥过期的锚点时间，表示该时间将被加到 `seconds` 客户端密钥的时间上以生成过期时间戳。仅 `created_at` 支持的值会被加到客户端密钥的时间上以生成过期时间戳。仅 `created_at` 目前受支持。

      - `"created_at"`

    - `seconds: optional number`

      从锚点时间到过期的秒数。请选择一个介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认值为 600 秒（10 分钟）。

### Realtime Translation Client Secret Create Response

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话持续将输入
    音频翻译为配置的目标语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转写。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转写文本增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `model: string`

      本次会话使用的 Realtime 翻译模型。该字段在
      会话创建时设置，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，适用于 Realtime 翻译会话。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Translation Input Audio Buffer Append 事件

- `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到翻译会话输入音频缓冲区。

  WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
  小端序原始音频字节。不受支持的 WebSocket 音频格式会返回
  验证错误，因为低质量音频会显著降低翻译
  质量。

  翻译以 200 ms 的引擎帧为处理单位。为获得最佳实时效果，请追加
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

    用于标识此事件的可选客户端生成 ID。

### Realtime Translation Input Transcript Delta 事件

- `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当可选的源语言转录文本可用时返回。该事件
  仅在配置了 `audio.input.transcription` 时发出。

  转录增量是仅追加的文本片段。客户端不应在增量之间插入
  无条件的空格。

  - `delta: string`

    仅追加的源语言转录文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.input_transcript.delta"`

    事件类型，必须为 `session.input_transcript.delta`.

    - `"session.input_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，源自可用的翻译帧
    。它以 200 毫秒为步长递增，但多个转录
    增量可能共享相同的 `elapsed_ms`。将其视为对齐元数据，
    而非唯一的转录增量标识符。

### 实时翻译输出音频增量事件

- `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

  当翻译后的输出音频可用时返回。该 `delta` 包含一个
  PCM16 音频块，其长度可能变化。客户端应对完整的
  增量进行解码并排队，而不是假定固定的字节数或采样数。

  - `delta: string`

    经过 Base64 编码的翻译音频数据。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_audio.delta"`

    事件类型，必须为 `session.output_audio.delta`.

    - `"session.output_audio.delta"`

  - `channels: optional number`

    音频通道数。

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，源自可用的翻译帧
    （如果可用）。请将 `elapsed_ms` 视为对齐元数据，而不是唯一的
    事件标识符。

  - `format: optional "pcm16"`

    音频编码格式，适用于 `delta`.

    - `"pcm16"`

  - `sample_rate: optional number`

    音频增量的采样率。

### 实时翻译输出转录 Delta 事件

- `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当翻译后的转录文本可用时返回。

  转录增量是仅追加的文本片段。客户端不应在增量之间插入
  无条件的空格。

  - `delta: string`

    翻译后输出音频的仅追加转录文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_transcript.delta"`

    事件类型，必须为 `session.output_transcript.delta`.

    - `"session.output_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，源自可用的翻译帧
    。它以 200 毫秒为步长递增，但多个转录
    增量可能共享相同的 `elapsed_ms`。将其视为对齐元数据，
    而非唯一的转录增量标识符。

### 实时翻译服务器事件

- `RealtimeTranslationServerEvent = RealtimeErrorEvent or RealtimeTranslationSessionCreatedEvent or RealtimeTranslationSessionUpdatedEvent or 4 more`

  一个 Realtime 翻译服务端事件。

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能来自客户端，也可能来自
    服务端。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认对错误消息进行监控和日志记录。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        易于理解的错误消息。

      - `type: string`

        错误类型（例如 "invalid_request_error"、"server_error"）。

      - `code: optional string or null`

        错误代码（如有）。

      - `event_id: optional string or null`

        导致错误的客户端事件的 event_id（如果适用）。

      - `param: optional string or null`

        与错误相关的参数（如有）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

    在翻译会话创建时返回。在建立新连接时作为首个服务端事件自动发送。此事件包含
    默认的翻译会话配置。
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

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转写。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍从
            输入音频流运行。

            - `model: string`

              用于源转录增量文本的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转写文本增量的目标语言。

      - `expires_at: number`

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `model: string`

        本次会话使用的 Realtime 翻译模型。该字段在
        会话创建时设置，且无法通过 `session.update`.

      - `type: "translation"`

        会话类型。始终为 `translation` ，适用于 Realtime 翻译会话。

        - `"translation"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

    在使用以下配置更新翻译会话时返回： `session.update` 事件响应，
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
    仅在配置了 `audio.input.transcription` 时发出。

    转录增量是仅追加的文本片段。客户端不应在增量之间插入
    无条件的空格。

    - `delta: string`

      仅追加的源语言转录文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.input_transcript.delta"`

      事件类型，必须为 `session.input_transcript.delta`.

      - `"session.input_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，源自可用的翻译帧
      。它以 200 毫秒为步长递增，但多个转录
      增量可能共享相同的 `elapsed_ms`。将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当翻译后的转录文本可用时返回。

    转录增量是仅追加的文本片段。客户端不应在增量之间插入
    无条件的空格。

    - `delta: string`

      翻译后输出音频的仅追加转录文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_transcript.delta"`

      事件类型，必须为 `session.output_transcript.delta`.

      - `"session.output_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，源自可用的翻译帧
      。它以 200 毫秒为步长递增，但多个转录
      增量可能共享相同的 `elapsed_ms`。将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

    当翻译后的输出音频可用时返回。该 `delta` 包含一个
    PCM16 音频块，其长度可能变化。客户端应对完整的
    增量进行解码并排队，而不是假定固定的字节数或采样数。

    - `delta: string`

      经过 Base64 编码的翻译音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_audio.delta"`

      事件类型，必须为 `session.output_audio.delta`.

      - `"session.output_audio.delta"`

    - `channels: optional number`

      音频通道数。

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，源自可用的翻译帧
      （如果可用）。请将 `elapsed_ms` 视为对齐元数据，而不是唯一的
      事件标识符。

    - `format: optional "pcm16"`

      音频编码格式，适用于 `delta`.

      - `"pcm16"`

    - `sample_rate: optional number`

      音频增量的采样率。

### Realtime Translation Session

- `RealtimeTranslationSession object { id, audio, expires_at, 2 more }`

  一个 Realtime 翻译会话。翻译会话持续将输入
  音频翻译为配置的目标语言。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转写。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍从
        输入音频流运行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转写文本增量的目标语言。

  - `expires_at: number`

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `model: string`

    本次会话使用的 Realtime 翻译模型。该字段在
    会话创建时设置，且无法通过 `session.update`.

  - `type: "translation"`

    会话类型。始终为 `translation` ，适用于 Realtime 翻译会话。

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

  Realtime 翻译会话配置。翻译会话会持续地流式传入源
  音频，并以增量方式流式输出翻译后的音频和转录文本。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转写。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍从
        输入音频流运行。

        - `model: string`

          用于源转写文本增量的转写模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转写文本增量的目标语言。

### Realtime Translation Session Created Event

- `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

  在翻译会话创建时返回。在建立新连接时作为首个服务端事件自动发送。此事件包含
  默认的翻译会话配置。
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

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转写。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转写文本增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `model: string`

      本次会话使用的 Realtime 翻译模型。该字段在
      会话创建时设置，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，适用于 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### Realtime Translation Session Update Event

- `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新翻译会话配置。翻译
  会话支持更新 `audio.output.language`, `audio.input.transcription`,
  和 `audio.input.noise_reduction`.

  - `session: RealtimeTranslationSessionUpdateRequest`

    要更新的翻译会话字段。会话 `type` 和 `model` 已设置
    在创建时，无法通过 `session.update`.

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转写。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转写文本增量的转写模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转写文本增量的目标语言。

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### Realtime Translation Session Update Request

- `RealtimeTranslationSessionUpdateRequest object { audio }`

  可通过以下方式更新的实时翻译会话字段 `session.update`.

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转写。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍从
        输入音频流运行。

        - `model: string`

          用于源转写文本增量的转写模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转写文本增量的目标语言。

### Realtime Translation Session Updated Event

- `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

  在使用以下配置更新翻译会话时返回： `session.update` 事件响应，
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

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转写。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转写文本增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `model: string`

      本次会话使用的 Realtime 翻译模型。该字段在
      会话创建时设置，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，适用于 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Realtime Truncation

- `RealtimeTruncation = "auto" or "disabled" or RetentionRatioTruncation { retention_ratio, type, token_limits }`

  当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

  客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

  截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

  可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

  - `"auto" or "disabled"`

    本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

    - `retention_ratio: number`

      超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用按比例保留的截断方式。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

      - `post_instructions: optional number`

        指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.delta"`

    事件类型，必须为 `response.output_audio.delta`.

    - `"response.output_audio.delta"`

### Response Audio Done Event

- `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

  当模型生成的音频完成时返回。在 Response
  被中断、未完成或取消时也会发出。

  - `content_index: number`

    条目内容数组中内容部分的索引。

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

### Response Audio Transcript Delta Event

- `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型对音频输出生成的转写更新时返回。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `delta: string`

    转写文本增量。

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

### Response Audio Transcript Done Event

- `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

  当模型对音频输出生成的转写完成时返回流
  式结果。在 Response 被中断、未完成或
  取消时也会发出。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `transcript: string`

    该音频的最终转写文本。

  - `type: "response.output_audio_transcript.done"`

    事件类型，必须为 `response.output_audio_transcript.done`.

    - `"response.output_audio_transcript.done"`

### Response Cancel Event

- `ResponseCancelEvent object { type, event_id, response_id }`

  发送此事件可取消正在进行的响应。服务端将响应一个
  包含一个 `response.done` 事件，其状态为 `response.status=cancelled`。如果没有可取消的响应，服务端将返回错误。即使没有正在进行的响应，调用
  没有正在进行的响应时，调用该事件是安全的，服务端将返回错误，会话不会受到影响。
  也是安全的； `response.cancel` 即便没有响应正在进行，也会返回错误，但
  会话将保持不受影响。

  - `type: "response.cancel"`

    事件类型，必须为 `response.cancel`.

    - `"response.cancel"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

  - `response_id: optional string`

    要取消的特定响应 ID——如果未提供，将取消
    默认对话中的进行中响应。

### Response Content Part Added Event

- `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

  在响应生成过程中，当新的内容部分被添加
  到助手消息项时返回。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被添加内容部分的项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `part: object { audio, text, transcript, type }`

    被添加的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果类型为 "audio"）。

    - `text: optional string`

      文本内容（如果类型为 "text"）。

    - `transcript: optional string`

      音频的转录文本（如果类型为 "audio"）。

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

  当助手消息项中的内容部分完成流式传输时返回。
  当 Response 被中断、不完整或取消时，也会发出此事件。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `part: object { audio, text, transcript, type }`

    已完成的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果类型为 "audio"）。

    - `text: optional string`

      文本内容（如果类型为 "text"）。

    - `transcript: optional string`

      音频的转录文本（如果类型为 "audio"）。

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

  一个 Response 至少包含一个 Item，也可能包含两个，此时
  第二个 Item 将是函数调用。这些 Item 默认会追加到
  对话历史中。

  服务器将返回一个 `response.created` 事件，以及为已创建 Items
  和内容生成的事件，最后是一个 `response.done` 事件，用于表示
  响应已完成。

  该 `response.create` 事件包含以下推理配置：
  `instructions` 和 `tools`。如果设置了这些配置，则会覆盖 Session 的
  配置，且仅适用于此 Response。

  可以在默认 Conversation 之外创建 Responses，这意味着它们可以
  可以有任意输入，并且可以禁用向 Conversation 写入输出。
  同一时刻只有一个 Response 可以向默认 Conversation 写入，但除此之外，多个
  Response 可以并行创建。 `metadata` 字段是区分多个并发
  Response 的好方法。

  客户端可以设置 `conversation` 为 `none` 以创建一个不写入默认 conversation 的 Response
  任意输入可以通过 `input` 字段提供，这是一个接受
  原始 Item 及对现有 Item 的引用。

  - `type: "response.create"`

    事件类型，必须为 `response.create`.

    - `"response.create"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

  - `response: optional RealtimeResponseCreateParams`

    使用这些参数创建一个新的 Realtime 响应。

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

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

          模型用于响应的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
          会话期间在模型至少响应过一次音频后更改。
          自定义声音必须由音频样本创建。
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

            自定义音色参考。

            - `id: string`

              自定义音色 ID，例如 `voice_1234`.

    - `conversation: optional string or "auto" or "none"`

      控制将响应添加到哪个对话。当前支持
      `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
      表示响应内容将添加到默认
      对话中。将此设置为 `none` 可创建带外响应，该响应
      不会向默认对话添加项。

      - `string`

      - `"auto" or "none"`

        控制将响应添加到哪个对话。当前支持
        `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
        表示响应内容将添加到默认
        对话中。将此设置为 `none` 可创建带外响应，该响应
        不会向默认对话添加项。

        - `"auto"`

        - `"none"`

    - `input: optional array of ConversationItem`

      要包含在模型提示词中的输入项。使用此字段
      会为此 Response 创建新上下文，而非使用默认
      对话。空数组 `[]` 将清除此 Response 的上下文。
      请注意，其中可能包含对此前会话中已出现项的引用
      并使用其 id。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终 `input_text` 用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          所回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终 `mcp_approval_response`.

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

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上工具进行调用的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数组成的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终 `mcp_call`.

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

        一个请求人工批准工具调用的 Realtime 项目。

        - `id: string`

          该批准请求的唯一 ID。

        - `arguments: string`

          该工具的 JSON 字符串形式参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起该请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `instructions: optional string`

      预先添加到模型调用中的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可指示模型的响应内容和格式（例如“务必简洁”“表现友好”“以下是优秀响应的示例”），以及音频行为（例如“快速说话”“在声音中注入情感”“经常笑”）。模型不保证遵循这些指令，但这些指令为模型期望行为提供了指导。
      请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      其中包含工具调用。提供 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
      默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      一组 16 个键值对，可附加到对象上。这可以
      用于以结构化
      格式存储有关对象的额外信息，并通过 API 或控制面板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前唯一可能的取值为
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      输出设为 `text` 模式将禁用模型的音频输出。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以在并行调用多个工具。仅由
      reasoning Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于在你的
        提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
        响应输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，固定为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

            输入项的类型，固定为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，固定为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

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

      模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（若有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以自行选择生成消息或调用一个或
        多个工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用指定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用
          它的指引，以及在调用时应当向用户说明
          （的内容（如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          采用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型，始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
          服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
          授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
          `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持的 `connector_id` 取值包括：

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

          此 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的筛选对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。以下之一： `always` 或
            `never`。设置为 `always`，时，所有工具都需要审批。设置为
            设置为 `never`，时，所有工具均不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Response Created Event

- `ResponseCreatedEvent object { event_id, response, type }`

  创建新的 Response 时返回。这是创建响应的第一个事件，
  此时响应处于初始状态 `in_progress`.

  - `event_id: string`

    服务端事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，类似于 `resp_1234`.

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

          模型用于回应的语音。一旦模型至少用音频回应过一次，
          本次会话内的语音便不可更改。当前可用的
          语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            本次会话内的语音便不可更改。当前可用的
            语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

      响应所加入的会话，由 `conversation`
      field in the `response.create` event. If `auto`, the response will be added to
      the default conversation and the value of `conversation_id` will be an id like
      `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有正在进行的响应，调用 `none`, the response will not be added to any conversation and
      the value of `conversation_id` 将为 `null`. If responses are being triggered
      automatically by VAD the response will be added to the default conversation

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      inclusive of tool calls, that was used in this response.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      一组 16 个键值对，可附加到对象上。这可以
      用于以结构化
      格式存储有关对象的额外信息，并通过 API 或控制面板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终 `input_text` 用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          所回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终 `mcp_approval_response`.

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

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上工具进行调用的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数组成的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终 `mcp_call`.

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

        一个请求人工批准工具调用的 Realtime 项目。

        - `id: string`

          该批准请求的唯一 ID。

        - `arguments: string`

          该工具的 JSON 字符串形式参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起该请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前唯一可能的取值为
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      输出设为 `text` 模式将禁用模型的音频输出。

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

        导致响应失败的错误说明，
        当 `status` 为 `failed`.

        - `code: optional string`

          错误代码（如有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        响应未完成的原因。对于 `cancelled` 响应，以下情况之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，以下情况之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被激活并中断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，与
        相对应的 `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      响应的用量统计信息，将对应于计费。
      Realtime API会话将维护对话上下文并追加新的
      项到对话中，因此之前轮次的输出（文本和
      音频 token）将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        有关响应中所用输入 token 的详细信息。缓存 token 是对话中之前轮次的 token，会作为上下文包含在当前响应中。此处的缓存 token 计为输入 token 的子集，这意味着输入 token 包含缓存和未缓存的 token。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数量。

        - `cached_tokens: optional number`

          用作 Response 输入的已缓存 token 数量。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          用作 Response 输入的已缓存 token 的详细信息。

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

        Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数量。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数量。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数量，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中包括输入和输出在内的 token 总数，
        包括文本和音频 token。

  - `type: "response.created"`

    事件类型，必须为 `response.created`.

    - `"response.created"`

### Response Done Event

- `ResponseDoneEvent object { event_id, response, type }`

  当 Response 完成流式传输时返回。无论何种情况都会发出，
  final state。事件中包含的 Response 对象将处于 `response.done` event will
  包含 Response 中的所有输出 Items，但会省略原始音频数据。

  客户端应检查 Response 的 `status` 字段，以判断响应是否成功
  (`completed`) 还是出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

  响应将包含在响应过程中生成的所有输出项，但不包括
  任何音频内容。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，类似于 `resp_1234`.

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

          模型用于回应的语音。一旦模型至少用音频回应过一次，
          本次会话内的语音便不可更改。当前可用的
          语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            本次会话内的语音便不可更改。当前可用的
            语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

      响应所加入的会话，由 `conversation`
      field in the `response.create` event. If `auto`, the response will be added to
      the default conversation and the value of `conversation_id` will be an id like
      `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有正在进行的响应，调用 `none`, the response will not be added to any conversation and
      the value of `conversation_id` 将为 `null`. If responses are being triggered
      automatically by VAD the response will be added to the default conversation

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      inclusive of tool calls, that was used in this response.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      一组 16 个键值对，可附加到对象上。这可以
      用于以结构化
      格式存储有关对象的额外信息，并通过 API 或控制面板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终 `input_text` 用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          所回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终 `mcp_approval_response`.

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

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上工具进行调用的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数组成的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终 `mcp_call`.

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

        一个请求人工批准工具调用的 Realtime 项目。

        - `id: string`

          该批准请求的唯一 ID。

        - `arguments: string`

          该工具的 JSON 字符串形式参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起该请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前唯一可能的取值为
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      输出设为 `text` 模式将禁用模型的音频输出。

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

        导致响应失败的错误说明，
        当 `status` 为 `failed`.

        - `code: optional string`

          错误代码（如有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        响应未完成的原因。对于 `cancelled` 响应，以下情况之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，以下情况之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被激活并中断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，与
        相对应的 `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      响应的用量统计信息，将对应于计费。
      Realtime API会话将维护对话上下文并追加新的
      项到对话中，因此之前轮次的输出（文本和
      音频 token）将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        有关响应中所用输入 token 的详细信息。缓存 token 是对话中之前轮次的 token，会作为上下文包含在当前响应中。此处的缓存 token 计为输入 token 的子集，这意味着输入 token 包含缓存和未缓存的 token。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数量。

        - `cached_tokens: optional number`

          用作 Response 输入的已缓存 token 数量。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          用作 Response 输入的已缓存 token 的详细信息。

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

        Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数量。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数量。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数量，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中包括输入和输出在内的 token 总数，
        包括文本和音频 token。

  - `type: "response.done"`

    事件类型，必须为 `response.done`.

    - `"response.done"`

### Response Function Call Arguments Delta Event

- `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

  当模型生成的函数调用参数被更新时返回。

  - `call_id: string`

    函数调用的 ID。

  - `delta: string`

    以 JSON 字符串形式表示的参数增量。

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

### Response Function Call Arguments Done Event

- `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

  在模型生成的函数调用参数流式传输完成时返回。
  当 Response 被中断、不完整或取消时，也会发出此事件。

  - `arguments: string`

    最终参数，形式为 JSON 字符串。

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

### Response Mcp Call Arguments Delta

- `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

  当响应生成期间 MCP 工具调用参数被更新时返回。

  - `delta: string`

    经过 JSON 编码的参数增量。

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

    如果存在，则表示增量文本已进行混淆处理。

### Response Mcp Call Arguments Done

- `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

  在响应生成过程中 MCP 工具调用参数确定时返回。

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

### Response Output Item Added Event

- `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

  在 Response 生成期间创建新的 Item 时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终 `input_text` 用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        所回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终 `mcp_approval_response`.

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

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上工具进行调用的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数组成的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终 `mcp_call`.

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

      一个请求人工批准工具调用的 Realtime 项目。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的 JSON 字符串形式参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    输出项在 Response 中的索引。

  - `response_id: string`

    该 Item 所属 Response 的 ID。

  - `type: "response.output_item.added"`

    事件类型，必须为 `response.output_item.added`.

    - `"response.output_item.added"`

### 响应输出项完成事件

- `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

  在 Item 流式传输完成时返回。也会在 Response 被
  中断、未完成或被取消时发出。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外上下文或指令。这与对话开始时提供的指令提示类似，但有所不同，因为系统消息可以在对话中的任意时间点添加。对于对话行为的重大更改，请使用指令；对于较小的更新（例如“用户现在正在询问其他主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终 `input_text` 用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是表示传递给函数的参数的 JSON 编码字符串，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        返回的 API 对象的标识符 - 始终 `realtime.item`。创建新条目时为可选。

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

        所回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终 `mcp_approval_response`.

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

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上工具进行调用的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数组成的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终 `mcp_call`.

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

      一个请求人工批准工具调用的 Realtime 项目。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的 JSON 字符串形式参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    输出项在 Response 中的索引。

  - `response_id: string`

    该 Item 所属 Response 的 ID。

  - `type: "response.output_item.done"`

    事件类型，必须为 `response.output_item.done`.

    - `"response.output_item.done"`

### 响应文本增量事件

- `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

  在 "output_text" 内容部分的文本值更新时返回。

  - `content_index: number`

    条目内容数组中内容部分的索引。

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

### 响应文本完成事件

- `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

  在 "output_text" 内容部分的文本值流式传输完成时返回。也会
  在 Response 被中断、未完成或被取消时发出。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `text: string`

    最终文本内容。

  - `type: "response.output_text.done"`

    事件类型，必须为 `response.output_text.done`.

    - `"response.output_text.done"`

### 会话创建事件

- `SessionCreatedEvent object { event_id, session, type }`

  在创建 Session 时返回。新连接建立时会自动作为第一个
  服务端事件发出。该事件将包含默认的 Session 配置。
  该默认 Session 配置。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果提供）。

          - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，到时后将自动触发模型响应。这在
                用户长时间停顿出乎意料的场景下非常有用，例如电话
                通话。模型将有效地基于当前上下文提示用户继续对话。
                在当前上下文下，提示用户继续对话。

                超时值将在上一次模型响应的音频播放完毕后开始计算，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联的)将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
                毫秒）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
                为 500 毫秒。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，
                因此在嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认设备产生输出时，是否自动中断任何正在进行的响应
                会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，是原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

            此参数是对生成后音频的后处理调整，
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            本次会话内的语音便不可更改。当前可用的
            语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回应的语音。一旦模型至少用音频回应过一次，
              本次会话内的语音便不可更改。当前可用的
              语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

        `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

        请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        其中包含工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
        默认为 `inf`.

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

        模型可以回复的模态集合。默认值为 `["audio"]`，表示
        使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
        模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的
          提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，固定为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

              输入项的类型，固定为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，固定为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

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

        模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以自行选择生成消息或调用一个或
          多个工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用指定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用
            它的指引，以及在调用时应当向用户说明
            （的内容（如有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            采用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
            授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
            `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 取值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。以下之一： `always` 或
              `never`。设置为 `always`，时，所有工具都需要审批。设置为
              设置为 `never`，时，所有工具均不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

        Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
        为会话启用追踪，便无法修改配置。

        `auto` 将使用以下默认值为此会话创建追踪：
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          用于追踪的精细配置。

          - `group_id: optional string`

            附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于启用
            Traces Dashboard 中的筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。用于在 Traces Dashboard 中
            为此追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

        客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

        截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

        可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

          - `retention_ratio: number`

            超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用按比例保留的截断方式。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

            - `post_instructions: optional number`

              指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      实时转录会话配置对象。

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

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果提供）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测的配置。可以设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（单位为
              毫秒）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静默时长（单位为毫秒）。默认
              为 500 毫秒。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值需要更响亮的音频才能激活模型，
              因此在嘈杂环境下可能会有更好的表现。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 目前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### 会话更新事件

- `SessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新会话的配置。
  客户端可以随时发送此事件以更新任意字段，
  但以下字段除外： `voice` 和 `model`. `voice` 仅当尚未产生其他音频输出时才能更新。

  当服务器收到 `session.update`，时，将响应
  包含一个 `session.updated` 事件，事件中会显示完整且生效的配置。
  仅更新 `session.update` 中存在的字段。要清除某个字段（如
  `instructions`，传入空字符串。若要清除字段，例如 `tools`，传入空数组。
  若要清除字段，例如 `turn_detection`，传入 `null`.

  若要关闭输入音频降噪，请发送以下 Realtime 事件：

  ```json
  {"type":"session.update","session":{"type":"realtime","audio":{"input":{"noise_reduction":null}}}}
  ```

  对于转录会话，请使用 `"type":"transcription"` 在 `session`.
  从更新中省略 `audio.input.noise_reduction` 会保持其当前设置不变。

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
            降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional AudioTranscription`

            输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

            - `delay: optional "minimal" or "low" or "medium" or 2 more`

              控制模型在输出转写文本之前等待多长时间。
              较高的值可以提高转写准确度，但会增加延迟。
              仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

            - `keywords: optional array of string`

              用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `language: optional string`

              输入音频的语言。在以下字段中提供输入语言：
              [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
              可提高准确度并降低延迟。

            - `languages: optional array of string`

              输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              可选的文本，用于引导模型风格或延续之前的音频
              片段。
              对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
              对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
              Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

          - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

            轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，到时后将自动触发模型响应。这在
                用户长时间停顿出乎意料的场景下非常有用，例如电话
                通话。模型将有效地基于当前上下文提示用户继续对话。
                在当前上下文下，提示用户继续对话。

                超时值将在上一次模型响应的音频播放完毕后开始计算，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联的)将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
                毫秒）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
                为 500 毫秒。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，
                因此在嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认设备产生输出时，是否自动中断任何正在进行的响应
                会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

        - `output: optional RealtimeAudioConfigOutput`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，是原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

            此参数是对生成后音频的后处理调整，
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

            模型用于响应的声音。支持的内置声音包括
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
            一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
            会话期间在模型至少响应过一次音频后更改。
            自定义声音必须由音频样本创建。
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

              自定义音色参考。

              - `id: string`

                自定义音色 ID，例如 `voice_1234`.

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

        请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        其中包含工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
        默认为 `inf`.

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

        模型可以回复的模态集合。默认值为 `["audio"]`，表示
        使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
        模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以在并行调用多个工具。仅由
        reasoning Realtime 模型，例如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的
          提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，固定为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

              输入项的类型，固定为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，固定为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

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

        模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以自行选择生成消息或调用一个或
          多个工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用指定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

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

            函数的描述，包括何时以及如何调用
            它的指引，以及在调用时应当向用户说明
            （的内容（如有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            采用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
            授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
            `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 取值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。以下之一： `always` 或
              `never`。设置为 `always`，时，所有工具都需要审批。设置为
              设置为 `never`，时，所有工具均不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional RealtimeTracingConfig or null`

        Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
        为会话启用追踪，便无法修改配置。

        `auto` 将使用以下默认值为此会话创建追踪：
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          用于追踪的精细配置。

          - `group_id: optional string`

            附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于启用
            Traces Dashboard 中的筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。用于在 Traces Dashboard 中
            为此追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

        客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

        截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

        可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

          - `retention_ratio: number`

            超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用按比例保留的截断方式。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

            - `post_instructions: optional number`

              指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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
            降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional AudioTranscription`

            输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

          - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

            轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，到时后将自动触发模型响应。这在
                用户长时间停顿出乎意料的场景下非常有用，例如电话
                通话。模型将有效地基于当前上下文提示用户继续对话。
                在当前上下文下，提示用户继续对话。

                超时值将在上一次模型响应的音频播放完毕后开始计算，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联的)将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
                毫秒）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
                为 500 毫秒。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，
                因此在嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认设备产生输出时，是否自动中断任何正在进行的响应
                会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。这是由客户端自行指定的任意字符串。如果该事件发生错误，它会被传回，但对应的 `session.updated` 事件将不会包含该 ID。

### 会话已更新事件

- `SessionUpdatedEvent object { event_id, session, type }`

  当会话使用 `session.update` 事件更新时返回，除非
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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果提供）。

          - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，到时后将自动触发模型响应。这在
                用户长时间停顿出乎意料的场景下非常有用，例如电话
                通话。模型将有效地基于当前上下文提示用户继续对话。
                在当前上下文下，提示用户继续对话。

                超时值将在上一次模型响应的音频播放完毕后开始计算，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联的)将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
                毫秒）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
                为 500 毫秒。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，
                因此在嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认设备产生输出时，是否自动中断任何正在进行的响应
                会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，是原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

            此参数是对生成后音频的后处理调整，
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            本次会话内的语音便不可更改。当前可用的
            语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回应的语音。一旦模型至少用音频回应过一次，
              本次会话内的语音便不可更改。当前可用的
              语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

        `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

        请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        其中包含工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
        默认为 `inf`.

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

        模型可以回复的模态集合。默认值为 `["audio"]`，表示
        使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
        模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的
          提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，固定为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

              输入项的类型，固定为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，固定为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

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

        模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以自行选择生成消息或调用一个或
          多个工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用指定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用
            它的指引，以及在调用时应当向用户说明
            （的内容（如有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            采用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
            授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
            `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 取值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。以下之一： `always` 或
              `never`。设置为 `always`，时，所有工具都需要审批。设置为
              设置为 `never`，时，所有工具均不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

        Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
        为会话启用追踪，便无法修改配置。

        `auto` 将使用以下默认值为此会话创建追踪：
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          用于追踪的精细配置。

          - `group_id: optional string`

            附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于启用
            Traces Dashboard 中的筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。用于在 Traces Dashboard 中
            为此追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

        客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

        截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

        可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

          - `retention_ratio: number`

            超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用按比例保留的截断方式。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

            - `post_instructions: optional number`

              指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      实时转录会话配置对象。

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

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果提供）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测的配置。可以设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（单位为
              毫秒）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静默时长（单位为毫秒）。默认
              为 500 毫秒。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值需要更响亮的音频才能激活模型，
              因此在嘈杂环境下可能会有更好的表现。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 目前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### 转录会话更新

- `TranscriptionSessionUpdate object { session, type, event_id }`

  发送此事件以更新转录会话。

  - `session: object { include, input_audio_format, input_audio_noise_reduction, 2 more }`

    实时转写会话对象配置。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在转录中包含的条目集合。当前可用的条目包括：
      `item.input_audio_transcription.logprobs`

      - `"item.input_audio_transcription.logprobs"`

    - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

      输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
      对于 `pcm16`,输入音频必须为 16 位 PCM,采样率 24kHz,
      单声道(mono),并采用小端字节序。

      - `"pcm16"`

      - `"g711_ulaw"`

      - `"g711_alaw"`

    - `input_audio_noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `input_audio_transcription: optional AudioTranscription`

      输入音频转录的配置。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供了额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待多长时间。
        较高的值可以提高转写准确度，但会增加延迟。
        仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在以下字段中提供输入语言：
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可提高准确度并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于引导模型风格或延续之前的音频
        片段。
        对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。可以设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到语音之前包含的音频量（单位为
        毫秒）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        用于检测语音停止的静默时长（单位为毫秒）。默认
        为 500 毫秒。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        高的阈值需要更响亮的音频才能激活模型，
        因此在嘈杂环境下可能会有更好的表现。

      - `type: optional "server_vad"`

        轮次检测的类型。仅 `server_vad` 目前支持用于转录会话。

        - `"server_vad"`

  - `type: "transcription_session.update"`

    事件类型，必须为 `transcription_session.update`.

    - `"transcription_session.update"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 转写会话已更新事件

- `TranscriptionSessionUpdatedEvent object { event_id, session, type }`

  当转录会话通过以下方式更新时返回 `transcription_session.update` 事件更新时返回，除非
  发生错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

    一个新的 Realtime 转录会话配置。

    当会话通过 REST API 在服务端创建时，会话对象
    还会包含一个临时密钥。密钥的默认 TTL 为 10 分钟。当会话通过
    WebSocket API 更新时，该属性不会出现。

    - `client_secret: object { expires_at, value }`

      由 API 返回的临时密钥。仅在会话通过 REST
      API 在服务端创建时存在。

      - `expires_at: number`

        令牌过期的时间戳。目前，所有令牌在
        一分钟后过期。

      - `value: string`

        可在客户端环境中用于对连接到 Realtime
        API 的连接进行认证的临时密钥。请在客户端环境中使用此密钥，
        而不是标准的 API 令牌，后者仅应在 服务端使用。

    - `input_audio_format: optional string`

      输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

    - `input_audio_transcription: optional object { language, languages, model, prompt }`

      转录模型的配置。

      - `language: optional string or null`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        为输入音频转录配置的提示词（如果提供）。

    - `modalities: optional array of "text" or "audio"`

      模型可用于回复的模态集合。若要禁用音频,
      可将其设置为 ["text"]。

      - `"text"`

      - `"audio"`

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。可以设置为 `null` 以关闭。服务端
      VAD 意味着模型将根据
      音频音量并在用户语音结束时进行响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到语音之前包含的音频量（单位为
        毫秒）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        用于检测语音停止的静默时长（单位为毫秒）。默认
        为 500 毫秒。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        高的阈值需要更响亮的音频才能激活模型，
        因此在嘈杂环境下可能会有更好的表现。

      - `type: optional string`

        轮次检测的类型，仅 `server_vad` 目前受支持。

  - `type: "transcription_session.updated"`

    事件类型，必须为 `transcription_session.updated`.

    - `"transcription_session.updated"`

# 通话

## 接听通话

**post** `/realtime/calls/{call_id}/accept`

接受来电 SIP 并配置将用于
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
      降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待多长时间。
        较高的值可以提高转写准确度，但会增加延迟。
        仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在以下字段中提供输入语言：
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可提高准确度并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于引导模型风格或延续之前的音频
        片段。
        对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，到时后将自动触发模型响应。这在
          用户长时间停顿出乎意料的场景下非常有用，例如电话
          通话。模型将有效地基于当前上下文提示用户继续对话。
          在当前上下文下，提示用户继续对话。

          超时值将在上一次模型响应的音频播放完毕后开始计算，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 关联的)将在达到超时时间时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否自动中断（取消）默认
          会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
          毫秒）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
          为 500 毫秒。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更响亮的音频才能激活模型，
          因此在嘈杂环境下可能会有更好的表现。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD 停止事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当默认设备产生输出时，是否自动中断任何正在进行的响应
          会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应的速度，是原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

      此参数是对生成后音频的后处理调整，
      也可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

      模型用于响应的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
      会话期间在模型至少响应过一次音频后更改。
      自定义声音必须由音频样本创建。
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

        自定义音色参考。

        - `id: string`

          自定义音色 ID，例如 `voice_1234`.

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在服务端输出中包含的额外字段。

  `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

  请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  其中包含工具调用。提供 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
  默认为 `inf`.

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

  模型可以回复的模态集合。默认值为 `["audio"]`，表示
  使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
  模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以在并行调用多个工具。仅由
  reasoning Realtime 模型，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    用于在你的
    提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
    响应输入类型，例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      发送给模型的文本输入。

      - `text: string`

        发送给模型的文本输入。

      - `type: "input_text"`

        输入项的类型，固定为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

        输入项的类型，固定为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送给模型的文件 ID。

      - `image_url: optional string or null`

        发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型，固定为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

        标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

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

  模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（若有）。

    `none` 表示模型将不调用任何工具，而是生成一条消息。

    `auto` 表示模型可以自行选择生成消息或调用一个或
    多个工具。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用指定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

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

      函数的描述，包括何时以及如何调用
      它的指引，以及在调用时应当向用户说明
      （的内容（如有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      采用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

    - `type: "mcp"`

      MCP 工具的类型，始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许使用的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
          MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          进行了标注，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
      服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
      授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
      `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持的 `connector_id` 取值包括：

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

      此 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的筛选对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。以下之一： `always` 或
        `never`。设置为 `always`，时，所有工具都需要审批。设置为
        设置为 `never`，时，所有工具均不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
  为会话启用追踪，便无法修改配置。

  `auto` 将使用以下默认值为此会话创建追踪：
  工作流名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    用于追踪的精细配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于启用
      Traces Dashboard 中的筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。用于在 Traces Dashboard 中
      为此追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

  客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

  截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

  可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

  - `"auto" or "disabled"`

    本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

    - `retention_ratio: number`

      超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用按比例保留的截断方式。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

      - `post_instructions: optional number`

        指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

通过 WebRTC 发起新的 Realtime API 调用，并接收完成对等连接所需的 SDP 应答
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

结束一个正在进行的 Realtime API 调用，无论该调用是通过 SIP 还是
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

## 调用参考

**post** `/realtime/calls/{call_id}/refer`

使用 SIP REFER 方法将正在进行的 SIP 通话转接到新目的地。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应出现在 SIP Refer-To 标头中的 URI。支持以下值：
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

  回传给调用方的 SIP 响应码。默认为 `603` (Decline)
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

创建一个 Realtime 客户端密钥，并附带相应的会话配置。

客户端密钥是短时效的令牌，可以传递给客户端应用，
例如网页前端或移动客户端，用于访问 Realtime API，而不会泄露你的主 API 密钥。
leaking your main 接口 key. You can configure a custom TTL for each client secret.

你也可以将会话配置选项附加到该客户端密钥，这些选项将
应用于使用该客户端密钥创建的所有会话，但这些选项也可以被
客户端连接覆盖。

[详细了解通过 WebRTC 使用客户端密钥进行身份验证](/api/docs/guides/realtime-webrtc).

返回已创建的客户端密钥以及生效的会话对象。客户端密钥是一个形如以下格式的字符串： `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期时间指的是客户端密钥不再可用于创建会话的时刻。会话本身在
  启动后可以在该时间之后继续。一个密钥在过期之前可用于创建多个会话，
  直到过期为止。
  直到过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点时间，表示该时间将被加到 `seconds` 客户端密钥的时间上以生成过期时间戳。仅 `created_at` 支持的值会被加到客户端密钥的时间上以生成过期时间戳。仅 `created_at` 目前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点时间到过期的秒数。请选择一个介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认值为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  客户端机密所使用的会话配置。选择实时
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
          降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转写文本之前等待多长时间。
            较高的值可以提高转写准确度，但会增加延迟。
            仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在以下字段中提供输入语言：
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            可提高准确度并降低延迟。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            可选的文本，用于引导模型风格或延续之前的音频
            片段。
            对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
            Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到时后将自动触发模型响应。这在
              用户长时间停顿出乎意料的场景下非常有用，例如电话
              通话。模型将有效地基于当前上下文提示用户继续对话。
              在当前上下文下，提示用户继续对话。

              超时值将在上一次模型响应的音频播放完毕后开始计算，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联的)将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
              毫秒）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
              为 500 毫秒。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更响亮的音频才能激活模型，
              因此在嘈杂环境下可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当默认设备产生输出时，是否自动中断任何正在进行的响应
              会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应的速度，是原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

          此参数是对生成后音频的后处理调整，
          也可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

          模型用于响应的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，方式为
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在
          会话期间在模型至少响应过一次音频后更改。
          自定义声音必须由音频样本创建。
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

            自定义音色参考。

            - `id: string`

              自定义音色 ID，例如 `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

      请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      其中包含工具调用。提供 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
      默认为 `inf`.

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

      模型可以回复的模态集合。默认值为 `["audio"]`，表示
      使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
      模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以在并行调用多个工具。仅由
      reasoning Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于在你的
        提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
        响应输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，固定为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

            输入项的类型，固定为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，固定为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

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

      模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（若有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以自行选择生成消息或调用一个或
        多个工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用指定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

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

          函数的描述，包括何时以及如何调用
          它的指引，以及在调用时应当向用户说明
          （的内容（如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          采用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型，始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
          服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
          授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
          `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持的 `connector_id` 取值包括：

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

          此 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的筛选对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。以下之一： `always` 或
            `never`。设置为 `always`，时，所有工具都需要审批。设置为
            设置为 `never`，时，所有工具均不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
      为会话启用追踪，便无法修改配置。

      `auto` 将使用以下默认值为此会话创建追踪：
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        用于追踪的精细配置。

        - `group_id: optional string`

          附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪的任意元数据，用于启用
          Traces Dashboard 中的筛选。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称。用于在 Traces Dashboard 中
          为此追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

      客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

      截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

      可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

      - `"auto" or "disabled"`

        本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

        - `retention_ratio: number`

          超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用按比例保留的截断方式。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

          - `post_instructions: optional number`

            指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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
          降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到时后将自动触发模型响应。这在
              用户长时间停顿出乎意料的场景下非常有用，例如电话
              通话。模型将有效地基于当前上下文提示用户继续对话。
              在当前上下文下，提示用户继续对话。

              超时值将在上一次模型响应的音频播放完毕后开始计算，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联的)将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
              毫秒）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
              为 500 毫秒。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更响亮的音频才能激活模型，
              因此在嘈杂环境下可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当默认设备产生输出时，是否自动中断任何正在进行的响应
              会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### 返回值

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元以来的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  realtime 或 transcription 会话的会话配置。

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

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }  or null`

          输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示词（如果提供）。

        - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到时后将自动触发模型响应。这在
              用户长时间停顿出乎意料的场景下非常有用，例如电话
              通话。模型将有效地基于当前上下文提示用户继续对话。
              在当前上下文下，提示用户继续对话。

              超时值将在上一次模型响应的音频播放完毕后开始计算，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联的)将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
              毫秒）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
              为 500 毫秒。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更响亮的音频才能激活模型，
              因此在嘈杂环境下可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当默认设备产生输出时，是否自动中断任何正在进行的响应
              会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应的速度，是原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

          此参数是对生成后音频的后处理调整，
          也可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的语音。一旦模型至少用音频回应过一次，
          本次会话内的语音便不可更改。当前可用的
          语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            本次会话内的语音便不可更改。当前可用的
            语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

      请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      其中包含工具调用。提供 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
      默认为 `inf`.

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

      模型可以回复的模态集合。默认值为 `["audio"]`，表示
      使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
      模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于在你的
        提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
        响应输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，固定为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

            输入项的类型，固定为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，固定为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

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

      模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（若有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以自行选择生成消息或调用一个或
        多个工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用指定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用
          它的指引，以及在调用时应当向用户说明
          （的内容（如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          采用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型，始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
          服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
          授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
          `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持的 `connector_id` 取值包括：

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

          此 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的筛选对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。以下之一： `always` 或
            `never`。设置为 `always`，时，所有工具都需要审批。设置为
            设置为 `never`，时，所有工具均不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

      Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
      为会话启用追踪，便无法修改配置。

      `auto` 将使用以下默认值为此会话创建追踪：
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        用于追踪的精细配置。

        - `group_id: optional string`

          附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪的任意元数据，用于启用
          Traces Dashboard 中的筛选。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称。用于在 Traces Dashboard 中
          为此追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

      客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

      截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

      可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

      - `"auto" or "disabled"`

        本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

        - `retention_ratio: number`

          超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用按比例保留的截断方式。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

          - `post_instructions: optional number`

            指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    实时转录会话配置对象。

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

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }  or null`

          转录模型的配置。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示词（如果提供）。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测的配置。可以设置为 `null` 以关闭。服务端
          VAD 意味着模型将根据
          音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此值必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到语音之前包含的音频量（单位为
            毫秒）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            用于检测语音停止的静默时长（单位为毫秒）。默认
            为 500 毫秒。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
            高的阈值需要更响亮的音频才能激活模型，
            因此在嘈杂环境下可能会有更好的表现。

          - `type: optional string`

            轮次检测的类型，仅 `server_vad` 目前受支持。

    - `expires_at: optional number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      要在服务端输出中包含的额外字段。

      - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

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

    realtime 或 transcription 会话的会话配置。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果提供）。

          - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，到时后将自动触发模型响应。这在
                用户长时间停顿出乎意料的场景下非常有用，例如电话
                通话。模型将有效地基于当前上下文提示用户继续对话。
                在当前上下文下，提示用户继续对话。

                超时值将在上一次模型响应的音频播放完毕后开始计算，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联的)将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
                毫秒）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
                为 500 毫秒。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，
                因此在嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认设备产生输出时，是否自动中断任何正在进行的响应
                会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，是原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

            此参数是对生成后音频的后处理调整，
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            本次会话内的语音便不可更改。当前可用的
            语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回应的语音。一旦模型至少用音频回应过一次，
              本次会话内的语音便不可更改。当前可用的
              语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

        `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

        请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        其中包含工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
        默认为 `inf`.

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

        模型可以回复的模态集合。默认值为 `["audio"]`，表示
        使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
        模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的
          提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，固定为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

              输入项的类型，固定为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，固定为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

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

        模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以自行选择生成消息或调用一个或
          多个工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用指定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用
            它的指引，以及在调用时应当向用户说明
            （的内容（如有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            采用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
            授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
            `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 取值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
                  MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。以下之一： `always` 或
              `never`。设置为 `always`，时，所有工具都需要审批。设置为
              设置为 `never`，时，所有工具均不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

        Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
        为会话启用追踪，便无法修改配置。

        `auto` 将使用以下默认值为此会话创建追踪：
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          用于追踪的精细配置。

          - `group_id: optional string`

            附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于启用
            Traces Dashboard 中的筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。用于在 Traces Dashboard 中
            为此追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

        客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

        截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

        可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

          - `retention_ratio: number`

            超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用按比例保留的截断方式。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

            - `post_instructions: optional number`

              指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      实时转录会话配置对象。

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

              降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果提供）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测的配置。可以设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（单位为
              毫秒）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静默时长（单位为毫秒）。默认
              为 500 毫秒。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值需要更响亮的音频才能激活模型，
              因此在嘈杂环境下可能会有更好的表现。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 目前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

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

      - `noise_reduction: optional object { type }  or null`

        输入音频降噪的配置。可设置为 `null` 以关闭。
        降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }  or null`

        输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外指引。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示词（如果提供）。

      - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

        轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致无法创建响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，到时后将自动触发模型响应。这在
            用户长时间停顿出乎意料的场景下非常有用，例如电话
            通话。模型将有效地基于当前上下文提示用户继续对话。
            在当前上下文下，提示用户继续对话。

            超时值将在上一次模型响应的音频播放完毕后开始计算，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 关联的)将在达到超时时间时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否自动中断（取消）默认
            会话（即。 `conversation` 的 `auto`)正在进行且有输出的响应。如果为 `true` ，则该响应将被取消；否则它将一直继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
            毫秒）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
            为 500 毫秒。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更响亮的音频才能激活模型，
            因此在嘈杂环境下可能会有更好的表现。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD 停止事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型的响应积极性。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当默认设备产生输出时，是否自动中断任何正在进行的响应
            会话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音响应的速度，是原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行时更改。

        此参数是对生成后音频的后处理调整，
        也可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回应的语音。一旦模型至少用音频回应过一次，
        本次会话内的语音便不可更改。当前可用的
        语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的语音。一旦模型至少用音频回应过一次，
          本次会话内的语音便不可更改。当前可用的
          语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
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

    `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式上的行为（例如“非常简洁”、“表现得友好”、“以下是优秀回复的示例”），以及音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常大笑”）。指令不保证被模型遵循，但可为模型提供期望行为的引导。

    请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    其中包含工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
    默认为 `inf`.

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

    模型可以回复的模态集合。默认值为 `["audio"]`，表示
    使模型以音频加文字转录的形式进行响应。 `["text"]` 也可以用来让
    模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于在你的
      提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
      响应输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，固定为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

          输入项的类型，固定为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，固定为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

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

    模型如何选择工具。提供以下字符串模式之一，或强制使用特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（若有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以自行选择生成消息或调用一个或
      多个工具。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用指定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何调用
        它的指引，以及在调用时应当向用户说明
        （的内容（如有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        采用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器为模型提供对额外工具的访问。
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

      - `type: "mcp"`

        MCP 工具的类型，始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

        允许使用的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，配合自定义 MCP
        服务器 URL 或服务连接器一起使用。你的应用必须处理 OAuth
        授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须
        `server_url`, `connector_id`，或 `tunnel_id` 提供其中之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持的 `connector_id` 取值包括：

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

        此 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的筛选对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP 服务器通过
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。以下之一： `always` 或
          `never`。设置为 `always`，时，所有工具都需要审批。设置为
          设置为 `never`，时，所有工具均不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。以下之一： `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的 Secure MCP Tunnel ID。以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

    Realtime API 可将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
    为会话启用追踪，便无法修改配置。

    `auto` 将使用以下默认值为此会话创建追踪：
    工作流名称、组 ID 和元数据。

    - `Auto = "auto"`

      启用追踪并设置追踪配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      用于追踪的精细配置。

      - `group_id: optional string`

        附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
        分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于启用
        Traces Dashboard 中的筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。用于在 Traces Dashboard 中
        为此追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

    客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

    截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

    可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

    - `"auto" or "disabled"`

      本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

      - `retention_ratio: number`

        超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用按比例保留的截断方式。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

        - `post_instructions: optional number`

          指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Transcription Session Create Response

- `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

  实时转录会话配置对象。

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

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }  or null`

        转录模型的配置。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示词（如果提供）。

      - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

        轮次检测的配置。可以设置为 `null` 以关闭。服务端
        VAD 意味着模型将根据
        音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此值必须为 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          在 VAD 检测到语音之前包含的音频量（单位为
          毫秒）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          用于检测语音停止的静默时长（单位为毫秒）。默认
          为 500 毫秒。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
          高的阈值需要更响亮的音频才能激活模型，
          因此在嘈杂环境下可能会有更好的表现。

        - `type: optional string`

          轮次检测的类型，仅 `server_vad` 目前受支持。

  - `expires_at: optional number`

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session Turn Detection

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此值必须为 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（单位为
    毫秒）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默时长（单位为毫秒）。默认
    为 500 毫秒。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，
    因此在嘈杂环境下可能会有更好的表现。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 目前受支持。

# Sessions

## Create session

**post** `/realtime/sessions`

创建一个临时 API 令牌，供客户端应用程序与
Realtime API 配合使用。可使用与
`session.update` 客户端事件相同的会话参数进行配置。

它返回一个会话对象，以及一个 `client_secret` 密钥，其中包含
可用于对浏览器客户端进行身份验证的可用临时 API 令牌
以使用 Realtime API。

返回已创建的 Realtime 会话对象以及一个临时密钥。

### 请求体参数

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌在
    一分钟后过期。

  - `value: string`

    可在客户端环境中用于对连接到 Realtime
    API 的连接进行认证的临时密钥。请在客户端环境中使用此密钥，
    而不是标准的 API 令牌，后者仅应在 服务端使用。

- `input_audio_format: optional string`

  输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { model }`

  输入音频转录的配置，默认关闭，可以
  设置为 `null` 开启后随时关闭。输入音频转录并非模型原生
  支持的功能，因为模型直接处理音频。转录任务
  异步执行，应视为大致参考
  而非模型实际理解的表示。

  - `model: optional string`

    用于转录的模型。

- `instructions: optional string`

  预先添加到模型调用中的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可指示模型的响应内容和格式（例如“务必简洁”“表现友好”“以下是优秀响应的示例”），以及音频行为（例如“快速说话”“在声音中注入情感”“经常笑”）。模型不保证遵循这些指令，但这些指令为模型期望行为提供了指导。
  请注意，如果未设置此字段，服务器会设置默认指令，并在会话开始时的 `session.created` 事件中显示。

- `max_response_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  其中包含工具调用。提供 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
  默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `modalities: optional array of "text" or "audio"`

  模型可用于回复的模态集合。若要禁用音频,
  可将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `output_audio_format: optional string`

  输出音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    用于在你的
    提示中替换变量的可选值映射。替换值可以是字符串，也可以是其他
    响应输入类型，例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      发送给模型的文本输入。

      - `text: string`

        发送给模型的文本输入。

      - `type: "input_text"`

        输入项的类型，固定为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

        输入项的类型，固定为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送给模型的文件 ID。

      - `image_url: optional string or null`

        发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型，固定为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会提高输入 token 使用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

        标记可复用提示前缀的确切结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `speed: optional number`

  模型语音回复的速度。1.0 是默认速度。0.25 是最低速度。
  1.5 是最高速度。该值只能在模型轮次之间更改，不能在回复进行中更改。
  in between model turns, not while a response is in progress.

- `temperature: optional number`

  模型的采样温度，范围限制为 [0.6, 1.2]，默认为 0.8。

- `tool_choice: optional string`

  模型选择工具的方式。选项包括 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of object { description, name, parameters, type }`

  可供模型使用的工具（函数）。

  - `description: optional string`

    函数的描述，包括何时以及如何调用
    它的指引，以及在调用时应当向用户说明
    （的内容（如有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    采用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }`

  追踪的配置选项。设置为 null 以禁用追踪。一旦
  为会话启用追踪，便无法修改配置。

  `auto` 将使用以下默认值为此会话创建追踪：
  工作流名称、组 ID 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    用于追踪的精细配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
      在追踪仪表板中进行分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于启用
      在追踪仪表板中进行筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。用于在 Traces Dashboard 中
      在追踪仪表板中为追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前最多只能将 28,224 个 token 包含在上下文中。

  客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种有效控制 token 用量和成本的方法。

  截断会减少下一轮中缓存的 token 数量（从而使缓存失效），因为消息会从上下文开头开始丢弃。不过，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，这样可以减少后续截断的需要，从而提高缓存命中率。

  可以完全禁用截断，这意味着服务端永远不会进行截断，而是当对话超出模型的输入 token 上限时返回错误。

  - `"auto" or "disabled"`

    本次会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超出输入 token 上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留对话 token 的一定比例。这样可以将截断分摊到多轮，从而有助于提高缓存 token 的使用率。

    - `retention_ratio: number`

      超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时使用。将该值设置为 `0.8` 表示会一直丢弃消息，直到已使用最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用按比例保留的截断方式。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      该截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

      - `post_instructions: optional number`

        指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 token 时将进行截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  音频音量并在用户语音结束时进行响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（单位为
    毫秒）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默时长（单位为毫秒）。默认
    为 500 毫秒。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，
    因此在嘈杂环境下可能会有更好的表现。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 目前受支持。

- `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

  模型用于响应的声音。支持的内置声音包括
  `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
  `marin`，以及 `cedar`。你也可以提供一个自定义语音对象，其中包含
  `id`，例如 `{ "id": "voice_1234" }`。语音在会话过程中无法更改，
  一旦模型至少响应过一次音频后便不可更改。
  自定义声音必须由音频样本创建。

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

    自定义音色参考。

    - `id: string`

      自定义音色 ID，例如 `voice_1234`.

### 返回值

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

    - `noise_reduction: optional object { type }  or null`

      输入音频降噪配置。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional object { language, languages, model, prompt }`

      输入音频转录的配置。

      - `language: optional string or null`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        为输入音频转录配置的提示词（如果提供）。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

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

  会话的过期时间戳，以自 Unix 纪元起的秒数表示。

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在服务端输出中包含的额外字段。

  - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  默认系统指令(即系统消息),会添加到模型调用之前。
  此字段允许客户端引导模型生成所需的
  回复。可以指示模型的回复内容和格式,
  (例如 "be extremely succinct"、"act friendly"、"here are examples of good
  responses")以及音频行为(例如 "talk quickly"、"inject emotion
  用你的声音","经常大笑"）。这些指令不一定保证
  会被模型遵循，但它们会为模型提供关于期望行为的
  指导。

  注意,服务端会设置默认指令,当此字段
  未设置时会使用默认指令,且默认指令可在 `session.created` event 中查看,该事件出现在
  会话开始时。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  其中包含工具调用。提供 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
  默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string`

  此会话使用的 Realtime 模型。

- `object: optional string`

  对象类型。始终为 `realtime.session`.

- `output_modalities: optional array of "text" or "audio"`

  模型可用于回复的模态集合。若要禁用音频,
  可将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `tool_choice: optional string`

  模型选择工具的方式。选项包括 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of RealtimeFunctionTool`

  可供模型使用的工具（函数）。

  - `description: optional string`

    函数的描述，包括何时以及如何调用
    它的指引，以及在调用时应当向用户说明
    （的内容（如有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    采用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }`

  追踪的配置选项。设置为 null 以禁用追踪。一旦
  为会话启用追踪，便无法修改配置。

  `auto` 将使用以下默认值为此会话创建追踪：
  工作流名称、组 ID 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    用于追踪的精细配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
      在追踪仪表板中进行分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于启用
      在追踪仪表板中进行筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。用于在 Traces Dashboard 中
      在追踪仪表板中为追踪命名。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  音频音量并在用户语音结束时进行响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（单位为
    毫秒）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默时长（单位为毫秒）。默认
    为 500 毫秒。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，
    因此在嘈杂环境下可能会有更好的表现。

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

## 域类型

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

      - `noise_reduction: optional object { type }  or null`

        输入音频降噪配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录的配置。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示词（如果提供）。

      - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

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

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    默认系统指令(即系统消息),会添加到模型调用之前。
    此字段允许客户端引导模型生成所需的
    回复。可以指示模型的回复内容和格式,
    (例如 "be extremely succinct"、"act friendly"、"here are examples of good
    responses")以及音频行为(例如 "talk quickly"、"inject emotion
    用你的声音","经常大笑"）。这些指令不一定保证
    会被模型遵循，但它们会为模型提供关于期望行为的
    指导。

    注意,服务端会设置默认指令,当此字段
    未设置时会使用默认指令,且默认指令可在 `session.created` event 中查看,该事件出现在
    会话开始时。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    其中包含工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 设为指定模型的可用 token 上限。默认为
    默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string`

    此会话使用的 Realtime 模型。

  - `object: optional string`

    对象类型。始终为 `realtime.session`.

  - `output_modalities: optional array of "text" or "audio"`

    模型可用于回复的模态集合。若要禁用音频,
    可将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `tool_choice: optional string`

    模型选择工具的方式。选项包括 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    可供模型使用的工具（函数）。

    - `description: optional string`

      函数的描述，包括何时以及如何调用
      它的指引，以及在调用时应当向用户说明
      （的内容（如有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      采用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }`

    追踪的配置选项。设置为 null 以禁用追踪。一旦
    为会话启用追踪，便无法修改配置。

    `auto` 将使用以下默认值为此会话创建追踪：
    工作流名称、组 ID 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      用于追踪的精细配置。

      - `group_id: optional string`

        附加到此追踪的组 ID，用于在 Traces Dashboard 中启用筛选和
        在追踪仪表板中进行分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于启用
        在追踪仪表板中进行筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。用于在 Traces Dashboard 中
        在追踪仪表板中为追踪命名。

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

    轮次检测的配置。可以设置为 `null` 以关闭。服务端
    VAD 意味着模型将根据
    音频音量并在用户语音结束时进行响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到语音之前包含的音频量（单位为
      毫秒）。默认为 300 毫秒。

    - `silence_duration_ms: optional number`

      用于检测语音停止的静默时长（单位为毫秒）。默认
      为 500 毫秒。该值越小，模型响应越快，
      但可能会在用户短暂的停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      高的阈值需要更响亮的音频才能激活模型，
      因此在嘈杂环境下可能会有更好的表现。

    - `type: optional string`

      轮次检测的类型，仅 `server_vad` 目前受支持。

# Transcription Sessions

## Create transcription session

**post** `/realtime/transcription_sessions`

创建一个临时 API 令牌，供客户端应用程序与
专门用于实时转写的 Realtime API。
可使用与相同的会话参数进行配置 `transcription_session.update` 客户端事件相同的会话参数进行配置。

它返回一个会话对象，以及一个 `client_secret` 密钥，其中包含
可用于对浏览器客户端进行身份验证的可用临时 API 令牌
以使用 Realtime API。

返回已创建的 Realtime 转写会话对象以及一个临时密钥。

### 请求体参数

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在转录中包含的条目集合。当前可用的条目包括：
  `item.input_audio_transcription.logprobs`

  - `"item.input_audio_transcription.logprobs"`

- `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

  输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
  对于 `pcm16`,输入音频必须为 16 位 PCM,采样率 24kHz,
  单声道(mono),并采用小端字节序。

  - `"pcm16"`

  - `"g711_ulaw"`

  - `"g711_alaw"`

- `input_audio_noise_reduction: optional object { type }`

  输入音频降噪的配置。可设置为 `null` 以关闭。
  降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行过滤。
  对音频进行过滤可以提高 VAD 和轮次检测的准确性（降低误报），并通过改善对输入音频的感知来提升模型表现。

  - `type: optional NoiseReductionType`

    降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

    - `"near_field"`

    - `"far_field"`

- `input_audio_transcription: optional AudioTranscription`

  输入音频转录的配置。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供了额外的指导。

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转写文本之前等待多长时间。
    较高的值可以提高转写准确度，但会增加延迟。
    仅在以下模型中受支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转写的单词或短语。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在以下字段中提供输入语言：
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    可提高准确度并降低延迟。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。受以下模型支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带有说话人标签的说话人分离时，请使用。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    可选的文本，用于引导模型风格或延续之前的音频
    片段。
    对于 `whisper-1`, the [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`) 时，prompt 是一个自由文本字符串，例如 "expect words related to technology"。
    Prompt 不支持以下模型： `gpt-realtime-whisper` 在 GA Realtime 会话中。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（单位为
    毫秒）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默时长（单位为毫秒）。默认
    为 500 毫秒。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，
    因此在嘈杂环境下可能会有更好的表现。

  - `type: optional "server_vad"`

    轮次检测的类型。仅 `server_vad` 目前支持用于转录会话。

    - `"server_vad"`

### 返回值

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。仅在会话通过 REST
  API 在服务端创建时存在。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌在
    一分钟后过期。

  - `value: string`

    可在客户端环境中用于对连接到 Realtime
    API 的连接进行认证的临时密钥。请在客户端环境中使用此密钥，
    而不是标准的 API 令牌，后者仅应在 服务端使用。

- `input_audio_format: optional string`

  输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { language, languages, model, prompt }`

  转录模型的配置。

  - `language: optional string or null`

    输入音频的语言。

  - `languages: optional array of string`

    为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    为输入音频转录配置的提示词（如果提供）。

- `modalities: optional array of "text" or "audio"`

  模型可用于回复的模态集合。若要禁用音频,
  可将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  音频音量并在用户语音结束时进行响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（单位为
    毫秒）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默时长（单位为毫秒）。默认
    为 500 毫秒。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，
    因此在嘈杂环境下可能会有更好的表现。

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
  "client_secret": {
    "value": "ek_abc123",
    "expires_at": 1742188264
  }
}
```

## 域类型

### 转录会话创建响应

- `TranscriptionSessionCreateResponse object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

  一个新的 Realtime 转录会话配置。

  当会话通过 REST API 在服务端创建时，会话对象
  还会包含一个临时密钥。密钥的默认 TTL 为 10 分钟。当会话通过
  WebSocket API 更新时，该属性不会出现。

  - `client_secret: object { expires_at, value }`

    由 API 返回的临时密钥。仅在会话通过 REST
    API 在服务端创建时存在。

    - `expires_at: number`

      令牌过期的时间戳。目前，所有令牌在
      一分钟后过期。

    - `value: string`

      可在客户端环境中用于对连接到 Realtime
      API 的连接进行认证的临时密钥。请在客户端环境中使用此密钥，
      而不是标准的 API 令牌，后者仅应在 服务端使用。

  - `input_audio_format: optional string`

    输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

  - `input_audio_transcription: optional object { language, languages, model, prompt }`

    转录模型的配置。

    - `language: optional string or null`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      为输入音频转录配置的提示词（如果提供）。

  - `modalities: optional array of "text" or "audio"`

    模型可用于回复的模态集合。若要禁用音频,
    可将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测的配置。可以设置为 `null` 以关闭。服务端
    VAD 意味着模型将根据
    音频音量并在用户语音结束时进行响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到语音之前包含的音频量（单位为
      毫秒）。默认为 300 毫秒。

    - `silence_duration_ms: optional number`

      用于检测语音停止的静默时长（单位为毫秒）。默认
      为 500 毫秒。该值越小，模型响应越快，
      但可能会在用户短暂的停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      高的阈值需要更响亮的音频才能激活模型，
      因此在嘈杂环境下可能会有更好的表现。

    - `type: optional string`

      轮次检测的类型，仅 `server_vad` 目前受支持。

# 翻译

# 客户端密钥

## 创建翻译客户端密钥

**post** `/realtime/translations/client_secrets`

创建一个 Realtime 翻译客户端密钥，并关联翻译会话配置。

客户端密钥是短时效的令牌，可以传递给客户端应用，
例如网页前端或移动客户端，它授予对 Realtime 的访问权限
翻译 API，而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义
TTL。

返回已创建的客户端密钥和生效的翻译会话对象。
客户端密钥是一个看起来类似以下内容的字符串 `ek_1234`.

### 请求体参数

- `session: RealtimeTranslationSessionCreateRequest`

  Realtime 翻译会话配置。翻译会话会持续地流式传入源
  音频，并以增量方式流式输出翻译后的音频和转录文本。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转写。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍从
        输入音频流运行。

        - `model: string`

          用于源转写文本增量的转写模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转写文本增量的目标语言。

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期时间指的是客户端密钥不再可用于创建会话的时刻。会话本身在
  启动后可以在该时间之后继续。一个密钥在过期之前可用于创建多个会话，
  直到过期为止。
  直到过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点时间，表示该时间将被加到 `seconds` 客户端密钥的时间上以生成过期时间戳。仅 `created_at` 支持的值会被加到客户端密钥的时间上以生成过期时间戳。仅 `created_at` 目前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点时间到过期的秒数。请选择一个介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认值为 600 秒（10 分钟）。

### 返回值

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话持续将输入
    音频翻译为配置的目标语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转写。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转写文本增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `model: string`

      本次会话使用的 Realtime 翻译模型。该字段在
      会话创建时设置，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，适用于 Realtime 翻译会话。

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
