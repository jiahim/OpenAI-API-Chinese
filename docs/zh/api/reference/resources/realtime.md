# Realtime

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 域类型

### 音频转写

- `AudioTranscription object { delay, keywords, language, 3 more }`

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转写文本前等待的时间。
    值越高可以提高转写准确度，但会增加延迟。
    仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在以下位置提供输入语言：
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    将提高准确度和降低延迟。

  - `languages: optional array of string`

    输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    可选的文本，用于指导模型的风格或延续先前的音频
    片段。
    对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
    提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

### 对话创建事件

- `ConversationCreatedEvent object { conversation, event_id, type }`

  会话创建时返回。在会话创建后立即发出。

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

### 对话条目

- `ConversationItem = RealtimeConversationItemSystemMessage or RealtimeConversationItemUserMessage or RealtimeConversationItemAssistantMessage or 6 more`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。对于系统消息，始终为 `input_text` 。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    实时对话中的函数调用项。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      所调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    实时对话中的函数调用输出项。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

      所回答的审批请求的 ID。

    - `approve: boolean`

      请求是否已获批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      决策的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 条目，列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述工具输入的 JSON 架构。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于工具的附加注释。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给工具的参数的 JSON 字符串。

    - `name: string`

      所运行的工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      相关联的审批请求的 ID（如果有）。

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

    一个请求人工批准工具调用的 Realtime 项。

    - `id: string`

      该审批请求的唯一 ID。

    - `arguments: string`

      工具的 JSON 字符串参数。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发出请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

### 对话条目已添加

- `ConversationItemAdded object { event_id, item, type, previous_item_id }`

  当某项（Item）被添加到默认对话（Conversation）时，服务器会发送此消息。这可能发生在以下几种情况：

  - 当客户端发送 `conversation.item.create` 事件时。
  - 当输入音频缓冲区被提交时。在这种情况下，该项将是一条包含缓冲区音频的用户消息。
  - 当模型正在生成响应（Response）时。在这种情况下， `conversation.item.added` 当模型开始生成特定项时，将发送该事件，因此它此时尚不包含任何内容（且 `status` 将为 `in_progress`).

  该事件将包含该项的完整内容（模型正在生成响应时除外），但音频数据除外，音频数据可以通过 `conversation.item.retrieve` 事件单独获取，如有必要。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        所调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 架构。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        相关联的审批请求的 ID（如果有）。

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

      一个请求人工批准工具调用的 Realtime 项。

      - `id: string`

        该审批请求的唯一 ID。

      - `arguments: string`

        工具的 JSON 字符串参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.added"`

    事件类型，必须为 `conversation.item.added`.

    - `"conversation.item.added"`

  - `previous_item_id: optional string or null`

    前一项的 ID（如果存在）。这用于在插入项时
    维护顺序。

### 对话项创建事件

- `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

  向对话的上下文中添加一个新项目，包括消息、函数
  调用和函数调用响应。此事件既可用于填充对话的
  “历史记录”，也可用于在流式传输过程中添加新项目，但目前
  存在限制，即无法填充助理音频消息。

  如果成功，服务器将响应一个 `conversation.item.created`
  事件，否则将发送一个 `error` 事件。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        所调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 架构。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        相关联的审批请求的 ID（如果有）。

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

      一个请求人工批准工具调用的 Realtime 项。

      - `id: string`

        该审批请求的唯一 ID。

      - `arguments: string`

        工具的 JSON 字符串参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.create"`

    事件类型，必须为 `conversation.item.create`.

    - `"conversation.item.create"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

  - `previous_item_id: optional string`

    新项目将插入到其后方的上一个项目的 ID。如果未设置，新项目将追加到对话末尾。

    如果设置为 `root`，新项目将添加到对话开头。

    如果设置为现有 ID，则允许在对话中间插入项目。如果找不到该 ID，将返回错误且不会添加该项目。

### 对话项已创建事件

- `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

  当会话条目被创建时返回。有几种场景会产生此事件：

  - 服务器正在生成一个响应，如果成功将产生
    一个或两个条目，类型为 `message`
    （角色 `assistant`) 或类型 `function_call`.
  - 输入音频缓冲区已提交，由客户端或
    服务器（在 `server_vad` 模式下）。服务器将获取
    输入音频缓冲区的内容并添加到新的用户消息条目中。
  - 客户端已发送 `conversation.item.create` 事件以向对话添加新条目
    。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        所调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 架构。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        相关联的审批请求的 ID（如果有）。

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

      一个请求人工批准工具调用的 Realtime 项。

      - `id: string`

        该审批请求的唯一 ID。

      - `arguments: string`

        工具的 JSON 字符串参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.created"`

    事件类型，必须为 `conversation.item.created`.

    - `"conversation.item.created"`

  - `previous_item_id: optional string or null`

    会话上下文中前一个条目的 ID，允许
    客户端了解对话顺序。可以是 `null` 如果
    条目没有前驱。

### 对话项删除事件

- `ConversationItemDeleteEvent object { item_id, type, event_id }`

  当你想从对话历史中移除任何项目时，发送此事件
  。服务器将响应一个 `conversation.item.deleted` 事件，
  除非该项目不存在于对话历史中，在这种情况下，
  服务器将响应一个错误。

  - `item_id: string`

    要删除的项目的 ID。

  - `type: "conversation.item.delete"`

    事件类型，必须为 `conversation.item.delete`.

    - `"conversation.item.delete"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 会话条目已删除事件

- `ConversationItemDeletedEvent object { event_id, item_id, type }`

  当对话中的某个条目被客户端通过某个
  `conversation.item.delete` 事件删除时返回此事件。该事件用于同步
  服务器对对话历史的理解与客户端的视图。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    被删除条目的 ID。

  - `type: "conversation.item.deleted"`

    事件类型，必须为 `conversation.item.deleted`.

    - `"conversation.item.deleted"`

### 对话条目完成

- `ConversationItemDone object { event_id, item, type, previous_item_id }`

  当会话项最终确定时返回。

  该事件将包含除音频数据外的完整项内容，音频数据可以稍后通过 `conversation.item.retrieve` 事件单独获取。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        所调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 架构。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        相关联的审批请求的 ID（如果有）。

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

      一个请求人工批准工具调用的 Realtime 项。

      - `id: string`

        该审批请求的唯一 ID。

      - `arguments: string`

        工具的 JSON 字符串参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.done"`

    事件类型，必须为 `conversation.item.done`.

    - `"conversation.item.done"`

  - `previous_item_id: optional string or null`

    前一项的 ID（如果存在）。这用于在插入项时
    维护顺序。

### 对话条目输入音频转录完成事件

- `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

  此事件是将写入
  用户音频缓冲区的音频转录为文本的输出。当输入音频缓冲区被
  客户端或服务端（当 VAD 启用时）提交时，转录开始。转录与 Response 创建
  异步运行，因此此事件可能在 Response 事件之前或之后
  到达。

  Realtime API 模型原生支持音频输入，因此输入转录是
  在独立的 ASR（自动语音识别）模型上运行的独立过程。
  转录文本可能在一定程度上偏离模型的解读，
  应视为粗略参考。

  - `content_index: number`

    包含音频的内容部分的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    包含正在转录的音频的条目 ID。

  - `transcript: string`

    转录后的文本。

  - `type: "conversation.item.input_audio_transcription.completed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.completed`.

    - `"conversation.item.input_audio_transcription.completed"`

  - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    转录的使用统计信息，此费用按照 ASR 模型的定价而非实时模型的定价计费。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 用量计费的模型的使用统计信息。

      - `input_tokens: number`

        此请求计费的输入 token 数量。

      - `output_tokens: number`

        生成的输出 token 数量。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        用量对象的类型。对于此变体，始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        有关此请求计费的输入 token 的详细信息。

        - `audio_tokens: optional number`

          此请求计费的音频 token 数量。

        - `text_tokens: optional number`

          此请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用统计信息。

      - `seconds: number`

        输入音频的时长（秒）。

      - `type: "duration"`

        用量对象的类型。对于此变体，始终为 `duration` 。

        - `"duration"`

  - `languages: optional array of TranscriptionLanguage`

    音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠检测到任何语言。

    - `code: string`

      音频中检测到的语言的代码。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。

    - `token: string`

      用于生成对数概率的 token。

    - `bytes: array of number`

      用于生成对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 会话项输入音频转录增量事件

- `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

  当输入音频转录内容部分的文本值被增量转录结果更新时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    包含正在转录的音频的条目 ID。

  - `type: "conversation.item.input_audio_transcription.delta"`

    事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

    - `"conversation.item.input_audio_transcription.delta"`

  - `content_index: optional number`

    内容部分在项目内容数组中的索引。

  - `delta: optional string`

    文本增量。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。这些可以通过配置会话启用 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应一个对数概率，表示此转录片段会选择哪个令牌。这有助于识别对于给定的转录片段是否存在多个有效选项的可能性。

    - `token: string`

      用于生成对数概率的 token。

    - `bytes: array of number`

      用于生成对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话条目输入音频转录失败事件

- `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

  当配置了输入音频转录，且用户消息的转录
  请求失败时返回。这些事件与其它事件分开，
  `error` 以便客户端能识别相关的 Item。

  - `content_index: number`

    包含音频的内容部分的索引。

  - `error: object { code, message, param, type }`

    转录错误的详细信息。

    - `code: optional string`

      错误代码（如有）。

    - `message: optional string`

      人类可读的错误消息。

    - `param: optional string`

      与错误相关的参数（如有）。

    - `type: optional string`

      错误的类型。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    用户消息项的 ID。

  - `type: "conversation.item.input_audio_transcription.failed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.failed`.

    - `"conversation.item.input_audio_transcription.failed"`

### 对话条目输入音频转录片段

- `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

  当输入音频转录片段被识别为某个条目时返回。

  - `id: string`

    片段标识符。

  - `content_index: number`

    条目内输入音频内容部分的索引。

  - `end: number`

    片段的结束时间（秒）。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    包含输入音频内容的条目的ID。

  - `speaker: string`

    此片段的检测到的说话者标签。

  - `start: number`

    片段的开始时间（秒）。

  - `text: string`

    此片段的文本。

  - `type: "conversation.item.input_audio_transcription.segment"`

    事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

    - `"conversation.item.input_audio_transcription.segment"`

### 对话项检索事件

- `ConversationItemRetrieveEvent object { item_id, type, event_id }`

  当你想要获取对话历史中某一特定项在服务端的表示时，发送此事件。例如，在噪声消除和 VAD 之后检查用户音频时，这会很有用。
  服务器将响应一个 `conversation.item.retrieved` 事件，
  除非该项目不存在于对话历史中，在这种情况下，
  服务器将响应一个错误。

  - `item_id: string`

    要检索的项 ID。

  - `type: "conversation.item.retrieve"`

    事件类型，必须为 `conversation.item.retrieve`.

    - `"conversation.item.retrieve"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 对话条目截断事件

- `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

  发送此事件以截断先前助手消息的音频。服务器
  生成音频的速度将快于实时，因此当用户
  中断以截断已发送到客户端但尚未播放的音频时，
  此事件非常有用。这将使服务器对音频的理解与
  客户端的播放同步。

  截断音频将删除服务端文本转录，以确保
  上下文中没有用户未听到的文本。

  如果成功，服务器将响应一个 `conversation.item.truncated`
  事件时。

  - `audio_end_ms: number`

    截断音频的包含持续时间上限，以毫秒为单位。如果
    audio_end_ms 大于实际音频持续时间，服务器
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

    可选的客户端生成的 ID，用于标识此事件。

### 对话条目已截断事件

- `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

  当较早的助手音频消息条目被以下操作截断时返回
  客户端通过 `conversation.item.truncate` 事件。此事件用于
  同步服务器对音频的理解与客户端的播放。

  此操作将截断音频并移除服务端文本转录
  以确保上下文中不存在用户尚未听到的文本。

  - `audio_end_ms: number`

    音频被截断到的时长，以毫秒为单位。

  - `content_index: number`

    被截断的内容部分的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    被截断的助手消息条目的ID。

  - `type: "conversation.item.truncated"`

    事件类型，必须为 `conversation.item.truncated`.

    - `"conversation.item.truncated"`

### 带引用的对话项目

- `ConversationItemWithReference object { id, arguments, call_id, 7 more }`

  要添加到对话中的条目。

  - `id: optional string`

    对于类型为（`message` | `function_call` | `function_call_output`)
    的条目，此字段允许客户端分配条目的唯一 ID。由于服务器会在未提供时自动生成一个，因此
    并非必填。

    对于类型为 `item_reference`，的条目，此字段为必填，是对对话中先前存在的任何条目的
    引用。

  - `arguments: optional string`

    函数调用的参数（用于 `function_call` 条目）。

  - `call_id: optional string`

    函数调用的 ID（用于 `function_call` 以及
    `function_call_output` 条目）。如果传给 `function_call_output`
    条目，服务器将检查对话历史中是否存在具有相同 `function_call` ID 的
    条目。

  - `content: optional array of object { id, audio, text, 2 more }`

    消息内容，适用于 `message` 条目。

    - 角色为 `system` 的消息条目仅支持 `input_text` 内容
    - 角色为 `user` 支持 `input_text` 以及 `input_audio`
      内容
    - 角色为 `assistant` 支持 `text` 内容。

    - `id: optional string`

      要引用的先前对话项目的 ID（用于 `item_reference`
      内容类型在 `response.create` 事件中）。这些可以引用
      客户端和服务端创建的项目。

    - `audio: optional string`

      Base64 编码的音频字节，用于 `input_audio` 内容类型。

    - `text: optional string`

      文本内容，用于 `input_text` 以及 `text` 内容类型。

    - `transcript: optional string`

      音频的转录文本，用于 `input_audio` 内容类型。

    - `type: optional "input_audio" or "input_text" or "item_reference" or "text"`

      内容类型（`input_text`, `input_audio`, `item_reference`, `text`).

      - `"input_audio"`

      - `"input_text"`

      - `"item_reference"`

      - `"text"`

  - `name: optional string`

    被调用函数的名称（用于 `function_call` 条目）。

  - `object: optional "realtime.item"`

    正在返回的 API 对象的标识符 - 始终 `realtime.item`.

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

    项目状态（`completed`, `incomplete`, `in_progress`）。这些对对话
    没有影响，但为了与
    `conversation.item.created` 事件时。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

  - `type: optional "message" or "function_call" or "function_call_output"`

    该条目的类型（`message`, `function_call`, `function_call_output`, `item_reference`).

    - `"message"`

    - `"function_call"`

    - `"function_call_output"`

### 输入音频缓冲区追加事件

- `InputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到输入音频缓冲区。该音频
  缓冲区是临时存储，你可以向其写入并在之后提交。"提交"将根据缓冲区内容在对话历史中创建新的
  用户消息项，并清空缓冲区。
  输入音频转录（如果启用）将在缓冲区提交时生成。

  如果启用了VAD，音频缓冲区将用于检测语音，服务器将决定
  何时提交。当服务器端VAD被禁用时，你必须手动提交音频缓冲区。
  输入音频降噪作用于对音频缓冲区的写入。

  客户端可以选择在每个事件中放置多少音频，最多
  15 MiB，例如从客户端流式传输较小的块可能允许
  VAD更灵敏。与大多数其他客户端事件不同，服务器
  不会对此事件发送确认响应。

  - `audio: string`

    Base64编码的音频字节。其格式必须符合会话配置中
    `input_audio_format` 字段指定的格式。

  - `type: "input_audio_buffer.append"`

    事件类型，必须为 `input_audio_buffer.append`.

    - `"input_audio_buffer.append"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区清空事件

- `InputAudioBufferClearEvent object { type, event_id }`

  发送此事件以清除缓冲区中的音频字节。服务器将
  以一条 `input_audio_buffer.cleared` 事件时。

  - `type: "input_audio_buffer.clear"`

    事件类型，必须为 `input_audio_buffer.clear`.

    - `"input_audio_buffer.clear"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区已清除事件

- `InputAudioBufferClearedEvent object { event_id, type }`

  当客户端通过以下方式清除输入音频缓冲区时返回
  `input_audio_buffer.clear` 事件时。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "input_audio_buffer.cleared"`

    事件类型，必须为 `input_audio_buffer.cleared`.

    - `"input_audio_buffer.cleared"`

### 输入音频缓冲区提交事件

- `InputAudioBufferCommitEvent object { type, event_id }`

  发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在服务器 VAD 模式下，客户端无需发送此事件，服务器将自动提交音频缓冲区。

  提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会从模型生成响应。服务器将以 `input_audio_buffer.committed` 事件时。

  - `type: "input_audio_buffer.commit"`

    事件类型，必须为 `input_audio_buffer.commit`.

    - `"input_audio_buffer.commit"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区已提交事件

- `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

  当输入音频缓冲区被提交时返回，无论是客户端还是
  在服务端 VAD 模式下自动触发。该 `item_id` 属性是用户
  消息项的 ID，该消息项将被创建，因此 `conversation.item.created` 事件
  也会发送给客户端。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    将被创建的用户消息项的 ID。

  - `type: "input_audio_buffer.committed"`

    事件类型，必须为 `input_audio_buffer.committed`.

    - `"input_audio_buffer.committed"`

  - `previous_item_id: optional string or null`

    新项目将插入其后的前一个项目的 ID。
    可以是 `null` 如果该项目没有前驱。

### 输入音频缓冲区 DTMF 事件接收事件

- `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

  **仅限SIP：** 收到 DTMF 事件时返回。DTMF 事件是一种表示
  电话键盘按键（0–9、*、#、A–D）的消息。 `event` 属性
  是用户按下的键盘按键。 `received_at` 是服务器收到事件时的
  UTC Unix 时间戳。

  - `event: string`

    用户按下的电话键盘按键。

  - `received_at: number`

    服务器收到 DTMF 事件时的 UTC Unix 时间戳。

  - `type: "input_audio_buffer.dtmf_event_received"`

    事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

    - `"input_audio_buffer.dtmf_event_received"`

### 输入音频缓冲区语音开始事件

- `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

  当处于 `server_vad` 模式时，服务器发送此事件，表示在
  音频缓冲区中检测到语音。只要音频被添加到
  缓冲区（除非已经检测到语音），就可能发生这种情况。客户端可能希望使用此
  事件来中断音频播放或向用户提供视觉反馈。

  客户端应期望在语音停止时收到 `input_audio_buffer.speech_stopped` 事件
  。当语音停止时， `item_id` 属性是将要创建的用户消息项
  的 ID，该消息项也会包含在
  `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
  音频缓冲区）。

  - `audio_start_ms: number`

    从会话期间写入缓冲区的所有音频开始计算，首次检测到语音的毫秒数。这将对应于
    发送给模型的音频开始时间，因此包含了
    在会话中配置的
    `prefix_padding_ms` 。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    语音停止时将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_started"`

    事件类型，必须为 `input_audio_buffer.speech_started`.

    - `"input_audio_buffer.speech_started"`

### 输入音频缓冲区语音停止事件

- `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

  在 `server_vad` 模式下，当服务器检测到
  音频缓冲区中的语音结束时，将返回该值。服务器还会发送 `conversation.item.created`
  一个事件，包含从音频缓冲区创建的用户消息项目。

  - `audio_end_ms: number`

    语音停止时自会话开始以来的毫秒数。这
    对应于发送给模型的音频结束时间，因此包括
    `min_silence_duration_ms` 。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    将被创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_stopped"`

    事件类型，必须为 `input_audio_buffer.speech_stopped`.

    - `"input_audio_buffer.speech_stopped"`

### 输入音频缓冲区超时触发

- `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

  当输入音频缓冲区触发服务器端 VAD 超时时返回。这是通过
  配置的 `idle_timeout_ms` 在会话的 `turn_detection` 设置中，它表示
  在配置的持续时间内未检测到任何语音。

  该 `audio_start_ms` 以及 `audio_end_ms` 字段表示从最后一次
  模型响应到触发时的音频片段，作为从写入的音频开头开始的偏移量
  到输入音频缓冲区。这意味着它划定了静音的音频片段，并且
  开始和结束值之间的差异将大致匹配配置的超时时间。

  空音频将作为 `input_audio` 项提交到对话中（将会有
  `input_audio_buffer.committed` 事件），并生成模型响应。可能存在
  未触发 VAD 但模型仍检测到的语音，因此模型可能回应
  与对话相关的内容或提示继续说话。

  - `audio_end_ms: number`

    超时触发时写入输入音频缓冲区的音频的毫秒偏移量。

  - `audio_start_ms: number`

    写入输入音频缓冲区的音频的毫秒偏移量，该缓冲区位于最后一次模型响应的播放时间之后。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    与此段关联的项目的 ID。

  - `type: "input_audio_buffer.timeout_triggered"`

    事件类型，必须为 `input_audio_buffer.timeout_triggered`.

    - `"input_audio_buffer.timeout_triggered"`

### 对数概率属性

- `LogProbProperties object { token, bytes, logprob }`

  一个对数概率对象。

  - `token: string`

    用于生成对数概率的 token。

  - `bytes: array of number`

    用于生成对数概率的字节。

  - `logprob: number`

    该 token 的对数概率。

### Mcp List Tools 已完成

- `McpListToolsCompleted object { event_id, item_id, type }`

  当某个条目的 MCP 工具列表操作完成时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具列表条目的 ID。

  - `type: "mcp_list_tools.completed"`

    事件类型，必须为 `mcp_list_tools.completed`.

    - `"mcp_list_tools.completed"`

### Mcp 工具列表失败

- `McpListToolsFailed object { event_id, item_id, type }`

  当某个项目列出 MCP 工具失败时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具列表条目的 ID。

  - `type: "mcp_list_tools.failed"`

    事件类型，必须为 `mcp_list_tools.failed`.

    - `"mcp_list_tools.failed"`

### Mcp 列出工具 进行中

- `McpListToolsInProgress object { event_id, item_id, type }`

  当正在为某个项目列出 MCP 工具时返回此结果。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具列表条目的 ID。

  - `type: "mcp_list_tools.in_progress"`

    事件类型，必须为 `mcp_list_tools.in_progress`.

    - `"mcp_list_tools.in_progress"`

### 降噪类型

- `NoiseReductionType = "near_field" or "far_field"`

  降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

  - `"near_field"`

  - `"far_field"`

### 输出音频缓冲区清除事件

- `OutputAudioBufferClearEvent object { type, event_id }`

  **仅 WebRTC/SIP：** 发送以切断当前的音频响应。这将触发服务器
  停止生成音频并发送一个 `output_audio_buffer.cleared` 事件。此
  事件应在其前发送一个 `response.cancel` 客户端事件来停止
  当前响应的生成。
  [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

  - `type: "output_audio_buffer.clear"`

    事件类型，必须为 `output_audio_buffer.clear`.

    - `"output_audio_buffer.clear"`

  - `event_id: optional string`

    用于错误处理的客户端事件的唯一 ID。

### 速率限制更新事件

- `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

  在 Response 开始时发出，以指示更新的速率限制。
  创建 Response 时，一些令牌将被“保留”用于输出
  令牌，此处显示的速率限制反映了该保留，随后在
  Response 完成时相应调整。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `rate_limits: array of object { limit, name, remaining, reset_seconds }`

    速率限制信息列表。

    - `limit: optional number`

      速率限制允许的最大值。

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

### 实时音频配置

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

      输入音频降噪配置。可设置为 `null` 以关闭。
      降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
      过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本前等待的时间。
        值越高可以提高转写准确度，但会增加延迟。
        仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在以下位置提供输入语言：
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        将提高准确度和降低延迟。

      - `languages: optional array of string`

        输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于指导模型的风格或延续先前的音频
        片段。
        对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
        提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

      语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

        - `type: "server_vad"`

          轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

          如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选超时时间，超过该时间后会自动触发模型响应。这
          对于用户长时间停顿属于意外情况（如电话
          通话）时非常有用。模型将根据当前上下文提示用户继续对话
          。

          超时值将在最后一条模型响应的音频播放完毕后应用，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          （与响应关联的）将在达到超时时间时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
          会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

          如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
          毫秒为单位）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
          为 500 毫秒。值越短，模型响应越快，
          但可能会在用户短暂停顿时抢话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
          阈值越高，需要更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来确定用户何时说完话。

        - `type: "semantic_vad"`

          轮转检测的类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在 VAD 开始事件发生时自动中断任何输出到默认
          会话（即。 `conversation` 的 `auto`）的进行中的响应。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型口语响应速度相对于原始速度的倍数。
      1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

      此参数是音频生成后的后处理调整，它
      也可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于响应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
      。
      我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

    输入音频降噪配置。可设置为 `null` 以关闭。
    降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
    过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转写文本前等待的时间。
      值越高可以提高转写准确度，但会增加延迟。
      仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在以下位置提供输入语言：
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      将提高准确度和降低延迟。

    - `languages: optional array of string`

      输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      可选的文本，用于指导模型的风格或延续先前的音频
      片段。
      对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
      提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

  - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

    语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

    语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

      - `type: "server_vad"`

        轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

        如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选超时时间，超过该时间后会自动触发模型响应。这
        对于用户长时间停顿属于意外情况（如电话
        通话）时非常有用。模型将根据当前上下文提示用户继续对话
        。

        超时值将在最后一条模型响应的音频播放完毕后应用，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        （与响应关联的）将在达到超时时间时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
        会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

        如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
        毫秒为单位）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
        为 500 毫秒。值越短，模型响应越快，
        但可能会在用户短暂停顿时抢话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
        阈值越高，需要更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来确定用户何时说完话。

      - `type: "semantic_vad"`

        轮转检测的类型， `semantic_vad` 以开启语义 VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在 VAD 开始事件发生时自动中断任何输出到默认
        会话（即。 `conversation` 的 `auto`）的进行中的响应。

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

    模型口语响应速度相对于原始速度的倍数。
    1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

    此参数是音频生成后的后处理调整，它
    也可以通过提示让模型说得更快或更慢。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于响应的声音。支持的内置声音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
    `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
    一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
    。
    我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

### 实时音频输入轮转检测

- `RealtimeAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

  语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

  对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

    - `type: "server_vad"`

      轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

      如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      可选超时时间，超过该时间后会自动触发模型响应。这
      对于用户长时间停顿属于意外情况（如电话
      通话）时非常有用。模型将根据当前上下文提示用户继续对话
      。

      超时值将在最后一条模型响应的音频播放完毕后应用，
      即设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
      （与响应关联的）将在达到超时时间时发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
      会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

      如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
      毫秒为单位）。默认为 300 毫秒。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
      为 500 毫秒。值越短，模型响应越快，
      但可能会在用户短暂停顿时抢话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
      阈值越高，需要更响亮的音频才能激活模型，
      因此在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来确定用户何时说完话。

    - `type: "semantic_vad"`

      轮转检测的类型， `semantic_vad` 以开启语义 VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      是否在 VAD 开始事件发生时自动中断任何输出到默认
      会话（即。 `conversation` 的 `auto`）的进行中的响应。

### 实时客户端事件

- `RealtimeClientEvent = ConversationItemCreateEvent or ConversationItemDeleteEvent or ConversationItemRetrieveEvent or 8 more`

  一个实时客户端事件。

  - `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

    向对话的上下文中添加一个新项目，包括消息、函数
    调用和函数调用响应。此事件既可用于填充对话的
    “历史记录”，也可用于在流式传输过程中添加新项目，但目前
    存在限制，即无法填充助理音频消息。

    如果成功，服务器将响应一个 `conversation.item.created`
    事件，否则将发送一个 `error` 事件。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息，始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          所调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否已获批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          决策的可选原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 条目，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON 架构。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数的 JSON 字符串。

        - `name: string`

          所运行的工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          相关联的审批请求的 ID（如果有）。

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

        一个请求人工批准工具调用的 Realtime 项。

        - `id: string`

          该审批请求的唯一 ID。

        - `arguments: string`

          工具的 JSON 字符串参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发出请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.create"`

      事件类型，必须为 `conversation.item.create`.

      - `"conversation.item.create"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

    - `previous_item_id: optional string`

      新项目将插入到其后方的上一个项目的 ID。如果未设置，新项目将追加到对话末尾。

      如果设置为 `root`，新项目将添加到对话开头。

      如果设置为现有 ID，则允许在对话中间插入项目。如果找不到该 ID，将返回错误且不会添加该项目。

  - `ConversationItemDeleteEvent object { item_id, type, event_id }`

    当你想从对话历史中移除任何项目时，发送此事件
    。服务器将响应一个 `conversation.item.deleted` 事件，
    除非该项目不存在于对话历史中，在这种情况下，
    服务器将响应一个错误。

    - `item_id: string`

      要删除的项目的 ID。

    - `type: "conversation.item.delete"`

      事件类型，必须为 `conversation.item.delete`.

      - `"conversation.item.delete"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ConversationItemRetrieveEvent object { item_id, type, event_id }`

    当你想要获取对话历史中某一特定项在服务端的表示时，发送此事件。例如，在噪声消除和 VAD 之后检查用户音频时，这会很有用。
    服务器将响应一个 `conversation.item.retrieved` 事件，
    除非该项目不存在于对话历史中，在这种情况下，
    服务器将响应一个错误。

    - `item_id: string`

      要检索的项 ID。

    - `type: "conversation.item.retrieve"`

      事件类型，必须为 `conversation.item.retrieve`.

      - `"conversation.item.retrieve"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

    发送此事件以截断先前助手消息的音频。服务器
    生成音频的速度将快于实时，因此当用户
    中断以截断已发送到客户端但尚未播放的音频时，
    此事件非常有用。这将使服务器对音频的理解与
    客户端的播放同步。

    截断音频将删除服务端文本转录，以确保
    上下文中没有用户未听到的文本。

    如果成功，服务器将响应一个 `conversation.item.truncated`
    事件时。

    - `audio_end_ms: number`

      截断音频的包含持续时间上限，以毫秒为单位。如果
      audio_end_ms 大于实际音频持续时间，服务器
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

      可选的客户端生成的 ID，用于标识此事件。

  - `InputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到输入音频缓冲区。该音频
    缓冲区是临时存储，你可以向其写入并在之后提交。"提交"将根据缓冲区内容在对话历史中创建新的
    用户消息项，并清空缓冲区。
    输入音频转录（如果启用）将在缓冲区提交时生成。

    如果启用了VAD，音频缓冲区将用于检测语音，服务器将决定
    何时提交。当服务器端VAD被禁用时，你必须手动提交音频缓冲区。
    输入音频降噪作用于对音频缓冲区的写入。

    客户端可以选择在每个事件中放置多少音频，最多
    15 MiB，例如从客户端流式传输较小的块可能允许
    VAD更灵敏。与大多数其他客户端事件不同，服务器
    不会对此事件发送确认响应。

    - `audio: string`

      Base64编码的音频字节。其格式必须符合会话配置中
      `input_audio_format` 字段指定的格式。

    - `type: "input_audio_buffer.append"`

      事件类型，必须为 `input_audio_buffer.append`.

      - `"input_audio_buffer.append"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `InputAudioBufferClearEvent object { type, event_id }`

    发送此事件以清除缓冲区中的音频字节。服务器将
    以一条 `input_audio_buffer.cleared` 事件时。

    - `type: "input_audio_buffer.clear"`

      事件类型，必须为 `input_audio_buffer.clear`.

      - `"input_audio_buffer.clear"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `OutputAudioBufferClearEvent object { type, event_id }`

    **仅 WebRTC/SIP：** 发送以切断当前的音频响应。这将触发服务器
    停止生成音频并发送一个 `output_audio_buffer.cleared` 事件。此
    事件应在其前发送一个 `response.cancel` 客户端事件来停止
    当前响应的生成。
    [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `type: "output_audio_buffer.clear"`

      事件类型，必须为 `output_audio_buffer.clear`.

      - `"output_audio_buffer.clear"`

    - `event_id: optional string`

      用于错误处理的客户端事件的唯一 ID。

  - `InputAudioBufferCommitEvent object { type, event_id }`

    发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在服务器 VAD 模式下，客户端无需发送此事件，服务器将自动提交音频缓冲区。

    提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会从模型生成响应。服务器将以 `input_audio_buffer.committed` 事件时。

    - `type: "input_audio_buffer.commit"`

      事件类型，必须为 `input_audio_buffer.commit`.

      - `"input_audio_buffer.commit"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ResponseCancelEvent object { type, event_id, response_id }`

    发送此事件以取消正在进行中的响应。服务器将
    以 `response.done` 状态为 `response.status=cancelled`。的
    事件作为回应。如果
    没有可取消的响应，服务器将返回错误。即使 `response.cancel` 没有正在进行的响应，调用
    也会返回错误，会话将不受影响。

    - `type: "response.cancel"`

      事件类型，必须为 `response.cancel`.

      - `"response.cancel"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

    - `response_id: optional string`

      要取消的特定响应 ID - 如果未提供，将取消
      默认对话中的进行中响应。

  - `ResponseCreateEvent object { type, event_id, response }`

    此事件指示服务器创建 Response，即触发
    模型推理。在服务器 VAD 模式下，服务器将自动创建 Responses
    。

    一个 Response 将至少包含一个 Item，也可能包含两个，在这种情况下
    第二个将是函数调用。这些 Items 将默认追加到
    对话历史中。

    服务器将响应一个 `response.created` 事件、用于 Items 的
    和内容创建的事件，以及最终的 `response.done` 事件以指示
    响应已完成。

    该 `response.create` 事件包括推理配置，
    `instructions` 以及 `tools`。如果设置了这些，它们将覆盖会话的
    仅针对此响应的配置。

    响应可以超出默认会话的带外创建，这意味着它们可以
    有任意输入，并且可以禁用将输出写入会话。
    一次只能有一个响应写入默认会话，但除此之外，多个
    响应可以并行创建。 `metadata` 字段是消除歧义的好方法
    多个同时进行的响应。

    客户端可以设置 `conversation` 为 `none` 来创建不写入默认
    会话的响应。任意输入可以通过 `input` 字段提供，这是一个接受
    原始项目和现有项目引用的数组。

    - `type: "response.create"`

      事件类型，必须为 `response.create`.

      - `"response.create"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

    - `response: optional RealtimeResponseCreateParams`

      使用这些参数创建新的实时响应

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
            `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
            一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
            。
            我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

        控制响应添加到哪个会话。目前支持
        `auto` 以及 `none`，以及 `auto` 作为默认值。 `auto` 值
        表示响应的内容将添加到默认
        对话中。将此设置为 `none` 以创建带外响应，该响应
        不会将项添加到默认对话中。

        - `string`

        - `"auto" or "none"`

          控制响应添加到哪个会话。目前支持
          `auto` 以及 `none`，以及 `auto` 作为默认值。 `auto` 值
          表示响应的内容将添加到默认
          对话中。将此设置为 `none` 以创建带外响应，该响应
          不会将项添加到默认对话中。

          - `"auto"`

          - `"none"`

      - `input: optional array of ConversationItem`

        要包含在模型提示中的输入项。使用此字段
        会为此响应创建新的上下文，而不是使用默认
        对话。空数组 `[]` 将清除此响应的上下文。
        请注意，这可以包含对会话中先前出现的项的引用，
        使用其 id。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

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

          一个 Realtime 条目，列出 MCP 服务器上可用的工具。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          一个请求人工批准工具调用的 Realtime 项。

      - `instructions: optional string`

        预置到模型调用之前的默认系统指令（即系统消息）。此字段允许客户端指导模型产生期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现友好”、“以下是良好响应的示例”），以及音频行为（例如“快速说话”、“在声音中注入情感”、“经常笑”）。不保证模型会遵循这些指令，但它们为模型提供了期望行为的指导。
        请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出令牌数，
        包括工具调用。提供一个介于 1 和 4096 之间的整数，以
        限制输出令牌，或 `inf` 用于获取给定模型的
        最大可用令牌。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        可附加到对象上的 16 个键值对集合。这可用于
        以结构化格式存储关于对象的附加信息，
        并通过 API 或仪表板查询对象。

        键是字符串，最大长度为 64 个字符。值是字符串，
        最大长度为 512 个字符。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前唯一可能的值是
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        输出设置为模式 `text` 将禁用模型的音频输出。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以并行调用多个工具。仅受
        推理 Realtime 模型（如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的值映射，用于替换你的
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            给模型的文本输入。

            - `text: string`

              给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `image_url: optional string or null`

              要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件的内容。

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `file_url: optional string`

              要发送给模型的文件的 URL。

            - `filename: optional string`

              要发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如）的推理投入
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供一种字符串模式，或强制指定某个
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个（如果有）工具。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个
          工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定函数。

          - `name: string`

            要调用的函数的名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
            调用它的指导，以及在调用时该告诉用户什么的指导
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            JSON Schema 中函数的参数。

          - `type: optional "function"`

            该工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol 让模型访问额外工具
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

            允许的工具名称列表或筛选对象。

            - `McpAllowedTools = array of string`

              允许的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
            自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
            必须处理 OAuth 授权流程并提供此处的令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 邮箱： `connector_outlookemail`
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

            此 MCP 工具是否延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要批准。可以是
              `always`, `never`，或与需要批准的工具关联的筛选器对象
              。

              - `always: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一批准策略。以下之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `SessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新会话的配置。
    客户端可随时发送此事件以更新任何字段
    除 `voice` 以及 `model`. `voice` 仅在没有其他音频输出时才能更新。

    当服务器收到 `session.update`，时，它将响应
    以 `session.updated` 事件，显示完整且有效的配置。
    只有存在于 `session.update` 中的字段才会被更新。要清除类似
    `instructions`，的字段，请传入空字符串。要清除类似 `tools`，的字段，请传入空数组。
    要清除类似 `turn_detection`，的字段，请传入 `null`.

    - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

      更新 Realtime 会话。选择实时
      会话或转录会话。

      - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

        Realtime 会话对象配置。

        - `type: "realtime"`

          要创建的会话类型。始终 `realtime` 用于 Realtime API。

          - `"realtime"`

        - `audio: optional RealtimeAudioConfig`

          输入和输出音频的配置。

          - `input: optional RealtimeAudioConfigInput`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪配置。可设置为 `null` 以关闭。
              降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
              过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional AudioTranscription`

              输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

              - `delay: optional "minimal" or "low" or "medium" or 2 more`

                控制模型在输出转写文本前等待的时间。
                值越高可以提高转写准确度，但会增加延迟。
                仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

                - `"minimal"`

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"xhigh"`

              - `keywords: optional array of string`

                用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

              - `language: optional string`

                输入音频的语言。在以下位置提供输入语言：
                [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
                将提高准确度和降低延迟。

              - `languages: optional array of string`

                输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                可选的文本，用于指导模型的风格或延续先前的音频
                片段。
                对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
                对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
                提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

            - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

              语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

              语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

                  如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选超时时间，超过该时间后会自动触发模型响应。这
                  对于用户长时间停顿属于意外情况（如电话
                  通话）时非常有用。模型将根据当前上下文提示用户继续对话
                  。

                  超时值将在最后一条模型响应的音频播放完毕后应用，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  （与响应关联的）将在达到超时时间时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
                  会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

                  如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
                  毫秒为单位）。默认为 300 毫秒。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
                  为 500 毫秒。值越短，模型响应越快，
                  但可能会在用户短暂停顿时抢话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                  阈值越高，需要更响亮的音频才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来确定用户何时说完话。

                - `type: "semantic_vad"`

                  轮转检测的类型， `semantic_vad` 以开启语义 VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在 VAD 开始事件发生时自动中断任何输出到默认
                  会话（即。 `conversation` 的 `auto`）的进行中的响应。

          - `output: optional RealtimeAudioConfigOutput`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型口语响应速度相对于原始速度的倍数。
              1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

              此参数是音频生成后的后处理调整，它
              也可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

              模型用于响应的声音。支持的内置声音有
              `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
              `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
              一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
              。
              我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

          服务器输出中包含的其他字段。

          `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

          请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单个助手响应的最大输出令牌数，
          包括工具调用。提供一个介于 1 和 4096 之间的整数，以
          限制输出令牌，或 `inf` 用于获取给定模型的
          最大可用令牌。默认为 `inf`.

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
          模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
          模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

          - `"text"`

          - `"audio"`

        - `parallel_tool_calls: optional boolean`

          模型是否可以并行调用多个工具。仅受
          推理 Realtime 模型（如 `gpt-realtime-2`.

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `reasoning: optional RealtimeReasoning`

          支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

        - `tool_choice: optional RealtimeToolChoiceConfig`

          模型如何选择工具。提供一种字符串模式，或强制指定某个
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪个（如果有）工具。

            `none` 表示模型不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息或调用一个或多个
            工具之间进行选择。

            `required` 表示模型必须调用一个或多个工具。

          - `ToolChoiceFunction object { name, type }`

            使用此选项强制模型调用特定函数。

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项强制模型调用远程 MCP 服务器上的特定工具。

        - `tools: optional RealtimeToolsConfig`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol 让模型访问额外工具
            (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

              允许的工具名称列表或筛选对象。

              - `McpAllowedTools = array of string`

                允许的工具名称字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
              自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
              必须处理 OAuth 授权流程并提供此处的令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
              关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

              当前支持的 `connector_id` 值包括：

              - Dropbox： `connector_dropbox`
              - Gmail： `connector_gmail`
              - Google 日历： `connector_googlecalendar`
              - Google Drive： `connector_googledrive`
              - Microsoft Teams： `connector_microsoftteams`
              - Outlook 日历： `connector_outlookcalendar`
              - Outlook 邮箱： `connector_outlookemail`
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

              此 MCP 工具是否延迟并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要批准。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要批准。可以是
                `always`, `never`，或与需要批准的工具关联的筛选器对象
                。

                - `always: optional object { read_only, tool_names }`

                  指定允许哪些工具的筛选对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或为只读。如果
                    MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此筛选条件。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  指定允许哪些工具的筛选对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或为只读。如果
                    MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此筛选条件。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一批准策略。以下之一 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `tracing: optional RealtimeTracingConfig or null`

          Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
          为会话启用了 追踪，配置便无法修改。

          `auto` 将为会话创建带有默认值的 追踪，用于
          工作流名称、组 ID 和元数据。

          - `Auto = "auto"`

            启用追踪并为追踪配置选项设置默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            追踪的精细配置。

            - `group_id: optional string`

              要附加到此追踪的组 ID，以启用过滤和
              在追踪仪表板中进行分组。

            - `metadata: optional unknown`

              要附加到此追踪的任意元数据，以启用
              在追踪仪表板中进行过滤。

            - `workflow_name: optional string`

              要附加到此追踪的工作流名称。此名称用于
              在追踪仪表板中命名此追踪。

        - `truncation: optional RealtimeTruncation`

          当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

          客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

          截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

          可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

          - `"auto" or "disabled"`

            用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

            - `retention_ratio: number`

              当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

              - `post_instructions: optional number`

                指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

      - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

        实时转录会话对象配置。

        - `type: "transcription"`

          要创建的会话类型。始终 `transcription` 用于转录会话。

          - `"transcription"`

        - `audio: optional RealtimeTranscriptionSessionAudio`

          输入和输出音频的配置。

          - `input: optional RealtimeTranscriptionSessionAudioInput`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪配置。可设置为 `null` 以关闭。
              降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
              过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `transcription: optional AudioTranscription`

              输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

            - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

              语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

              语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

                  如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选超时时间，超过该时间后会自动触发模型响应。这
                  对于用户长时间停顿属于意外情况（如电话
                  通话）时非常有用。模型将根据当前上下文提示用户继续对话
                  。

                  超时值将在最后一条模型响应的音频播放完毕后应用，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  （与响应关联的）将在达到超时时间时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
                  会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

                  如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
                  毫秒为单位）。默认为 300 毫秒。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
                  为 500 毫秒。值越短，模型响应越快，
                  但可能会在用户短暂停顿时抢话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                  阈值越高，需要更响亮的音频才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来确定用户何时说完话。

                - `type: "semantic_vad"`

                  轮转检测的类型， `semantic_vad` 以开启语义 VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在 VAD 开始事件发生时自动中断任何输出到默认
                  会话（即。 `conversation` 的 `auto`）的进行中的响应。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          服务器输出中包含的其他字段。

          `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。这是客户端可以分配的任意字符串。如果事件出错，它将传回，但相应的 `session.updated` 事件不会包含它。

### Realtime 会话条目助手消息

- `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

  实时对话中的助手消息项。

  - `content: array of object { audio, text, transcript, type }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

    条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

  - `object: optional "realtime.item"`

    正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 会话条目函数调用

- `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

  实时对话中的函数调用项。

  - `arguments: string`

    函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

  - `name: string`

    所调用函数的名称。

  - `type: "function_call"`

    条目的类型。始终为 `function_call`.

    - `"function_call"`

  - `id: optional string`

    条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

  - `call_id: optional string`

    函数调用的 ID。

  - `object: optional "realtime.item"`

    正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 会话条目函数调用输出

- `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

  实时对话中的函数调用输出项。

  - `call_id: string`

    此输出对应的函数调用的 ID。

  - `output: string`

    函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

  - `type: "function_call_output"`

    条目的类型。始终为 `function_call_output`.

    - `"function_call_output"`

  - `id: optional string`

    条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

  - `object: optional "realtime.item"`

    正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 会话条目系统消息

- `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

  Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

  - `content: array of object { text, type }`

    消息的内容。

    - `text: optional string`

      文本内容。

    - `type: optional "input_text"`

      内容类型。对于系统消息，始终为 `input_text` 。

      - `"input_text"`

  - `role: "system"`

    消息发送者的角色。始终为 `system`.

    - `"system"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

  - `object: optional "realtime.item"`

    正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 会话条目用户消息

- `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

  Realtime 对话中的用户消息条目。

  - `content: array of object { audio, detail, image_url, 3 more }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

      音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

    条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

  - `object: optional "realtime.item"`

    正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

    错误的类型（例如，"invalid_request_error"、"server_error"）。

  - `code: optional string or null`

    错误代码（如有）。

  - `event_id: optional string or null`

    导致错误的客户端事件的 event_id（如果适用）。

  - `param: optional string or null`

    与错误相关的参数（如有）。

### 实时错误事件

- `RealtimeErrorEvent object { error, event_id, type }`

  发生错误时返回，可能是客户端问题或服务器
  问题。大多数错误是可恢复的，会话将保持打开状态，我们
  建议实现方默认监控并记录错误消息。

  - `error: RealtimeError`

    错误的详细信息。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误的类型（例如，"invalid_request_error"、"server_error"）。

    - `code: optional string or null`

      错误代码（如有）。

    - `event_id: optional string or null`

      导致错误的客户端事件的 event_id（如果适用）。

    - `param: optional string or null`

      与错误相关的参数（如有）。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "error"`

    事件类型，必须为 `error`.

    - `"error"`

### Realtime 函数工具

- `RealtimeFunctionTool object { description, name, parameters, type }`

  - `description: optional string`

    函数的描述，包括何时以及如何
    调用它的指导，以及在调用时该告诉用户什么的指导
    （如果有的话）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    JSON Schema 中函数的参数。

  - `type: optional "function"`

    该工具的类型，即 `function`.

    - `"function"`

### Realtime MCP 审批请求

- `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

  一个请求人工批准工具调用的 Realtime 项。

  - `id: string`

    该审批请求的唯一 ID。

  - `arguments: string`

    工具的 JSON 字符串参数。

  - `name: string`

    要运行的工具名称。

  - `server_label: string`

    发出请求的 MCP 服务器的标签。

  - `type: "mcp_approval_request"`

    条目的类型。始终为 `mcp_approval_request`.

    - `"mcp_approval_request"`

### Realtime MCP 审批响应

- `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

  响应 MCP 审批请求的实时项。

  - `id: string`

    审批响应的唯一 ID。

  - `approval_request_id: string`

    所回答的审批请求的 ID。

  - `approve: boolean`

    请求是否已获批准。

  - `type: "mcp_approval_response"`

    条目的类型。始终为 `mcp_approval_response`.

    - `"mcp_approval_response"`

  - `reason: optional string or null`

    决策的可选原因。

### Realtime MCP 工具列表

- `RealtimeMcpListTools object { server_label, tools, type, id }`

  一个 Realtime 条目，列出 MCP 服务器上可用的工具。

  - `server_label: string`

    MCP 服务器的标签。

  - `tools: array of object { input_schema, name, annotations, description }`

    服务器上可用的工具。

    - `input_schema: unknown`

      描述工具输入的 JSON 架构。

    - `name: string`

      工具的名称。

    - `annotations: optional unknown or null`

      关于工具的附加注释。

    - `description: optional string or null`

      工具的描述。

  - `type: "mcp_list_tools"`

    条目的类型。始终为 `mcp_list_tools`.

    - `"mcp_list_tools"`

  - `id: optional string`

    列表的唯一 ID。

### Realtime MCP 协议错误

- `RealtimeMcpProtocolError object { code, message, type }`

  - `code: number`

  - `message: string`

  - `type: "protocol_error"`

    - `"protocol_error"`

### Realtime MCP 工具调用

- `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

  一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

  - `id: string`

    工具调用的唯一 ID。

  - `arguments: string`

    传递给工具的参数的 JSON 字符串。

  - `name: string`

    所运行的工具的名称。

  - `server_label: string`

    运行该工具的 MCP 服务器的标签。

  - `type: "mcp_call"`

    条目的类型。始终为 `mcp_call`.

    - `"mcp_call"`

  - `approval_request_id: optional string or null`

    相关联的审批请求的 ID（如果有）。

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

### Realtime MCP 工具执行错误

- `RealtimeMcpToolExecutionError object { message, type }`

  - `message: string`

  - `type: "tool_execution_error"`

    - `"tool_execution_error"`

### Realtime MCPHTTP 错误

- `RealtimeMcphttpError object { code, message, type }`

  - `code: number`

  - `message: string`

  - `type: "http_error"`

    - `"http_error"`

### Realtime 推理

- `RealtimeReasoning object { effort }`

  支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制支持推理的 Realtime 模型（例如）的推理投入
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

### Realtime 推理努力

- `RealtimeReasoningEffort = "minimal" or "low" or "medium" or 2 more`

  限制支持推理的 Realtime 模型（例如）的推理投入
  `gpt-realtime-2`.

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

### Realtime 响应

- `RealtimeResponse object { id, audio, conversation_id, 8 more }`

  响应资源。

  - `id: optional string`

    响应的唯一 ID，格式类似于 `resp_1234`.

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

        模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
        便无法更改。当前
        可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
          便无法更改。当前
          可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

    响应被添加到的会话，由事件中的 `conversation`
    字段决定。如果 `response.create` ，则响应不会 `auto`，被添加到任何会话，且
    的值将为 `conversation_id` 。如果响应是由 VAD
    `conv_1234`。的 `none`，自动触发的，则响应将被添加到默认会话，且
    的值将为 `conversation_id` 将为 `null`。如果响应正在被
    自动触发，则响应将被添加到默认会话

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出令牌数，
    （包括工具调用），用于此响应。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 个键值对集合。这可用于
    以结构化格式存储关于对象的附加信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        所调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 架构。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        相关联的审批请求的 ID（如果有）。

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

      一个请求人工批准工具调用的 Realtime 项。

      - `id: string`

        该审批请求的唯一 ID。

      - `arguments: string`

        工具的 JSON 字符串参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的值是
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    输出设置为模式 `text` 将禁用模型的音频输出。

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
      当 `status` 为 `failed`.

      - `code: optional string`

        错误代码（如有）。

      - `type: optional string`

        错误的类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      响应未完成的原因。对于 `cancelled` 响应，为以下之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，为以下之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器激活并截断了响应）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致响应失败的错误类型，对应
      与 `status` 字段（`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    响应的使用统计，这将对应计费。一个
    Realtime API 会话将维护对话上下文并追加新的
    项目到对话中，因此前几轮的输出（文本和
    音频令牌）将成为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      关于响应中使用的输入令牌的详细信息。缓存令牌是对话中前几轮的令牌，作为当前响应的上下文包含在内。这里的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和非缓存令牌。

      - `audio_tokens: optional number`

        作为 Response 输入使用的音频 token 数量。

      - `cached_tokens: optional number`

        作为 Response 输入使用的缓存 token 数量。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        作为 Response 输入使用的缓存 token 的详细信息。

        - `audio_tokens: optional number`

          作为 Response 输入使用的缓存音频 token 数量。

        - `image_tokens: optional number`

          作为 Response 输入使用的缓存图像 token 数量。

        - `text_tokens: optional number`

          作为 Response 输入使用的缓存文本 token 数量。

      - `image_tokens: optional number`

        作为 Response 输入使用的图像 token 数量。

      - `text_tokens: optional number`

        作为 Response 输入使用的文本 token 数量。

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

      Response 中的 token 总数，包括输入和输出
      文本和音频 token。

### Realtime 响应创建音频输出

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
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
      。
      我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

### Realtime 响应创建参数

- `RealtimeResponseCreateParams object { audio, conversation, input, 9 more }`

  使用这些参数创建新的实时响应

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
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
        一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
        。
        我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

    控制响应添加到哪个会话。目前支持
    `auto` 以及 `none`，以及 `auto` 作为默认值。 `auto` 值
    表示响应的内容将添加到默认
    对话中。将此设置为 `none` 以创建带外响应，该响应
    不会将项添加到默认对话中。

    - `string`

    - `"auto" or "none"`

      控制响应添加到哪个会话。目前支持
      `auto` 以及 `none`，以及 `auto` 作为默认值。 `auto` 值
      表示响应的内容将添加到默认
      对话中。将此设置为 `none` 以创建带外响应，该响应
      不会将项添加到默认对话中。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    要包含在模型提示中的输入项。使用此字段
    会为此响应创建新的上下文，而不是使用默认
    对话。空数组 `[]` 将清除此响应的上下文。
    请注意，这可以包含对会话中先前出现的项的引用，
    使用其 id。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        所调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 架构。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        相关联的审批请求的 ID（如果有）。

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

      一个请求人工批准工具调用的 Realtime 项。

      - `id: string`

        该审批请求的唯一 ID。

      - `arguments: string`

        工具的 JSON 字符串参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    预置到模型调用之前的默认系统指令（即系统消息）。此字段允许客户端指导模型产生期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现友好”、“以下是良好响应的示例”），以及音频行为（例如“快速说话”、“在声音中注入情感”、“经常笑”）。不保证模型会遵循这些指令，但它们为模型提供了期望行为的指导。
    请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出令牌数，
    包括工具调用。提供一个介于 1 和 4096 之间的整数，以
    限制输出令牌，或 `inf` 用于获取给定模型的
    最大可用令牌。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 个键值对集合。这可用于
    以结构化格式存储关于对象的附加信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的值是
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    输出设置为模式 `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅受
    推理 Realtime 模型（如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的值映射，用于替换你的
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        给模型的文本输入。

        - `text: string`

          给模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送给模型的文件的 ID。

        - `image_url: optional string or null`

          要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送给模型的文件的内容。

        - `file_id: optional string or null`

          要发送给模型的文件的 ID。

        - `file_url: optional string`

          要发送给模型的文件的 URL。

        - `filename: optional string`

          要发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如）的推理投入
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。提供一种字符串模式，或强制指定某个
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个（如果有）工具。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或多个
      工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项强制模型调用特定函数。

      - `name: string`

        要调用的函数的名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
        调用它的指导，以及在调用时该告诉用户什么的指导
        （如果有的话）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        JSON Schema 中函数的参数。

      - `type: optional "function"`

        该工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol 让模型访问额外工具
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

        允许的工具名称列表或筛选对象。

        - `McpAllowedTools = array of string`

          允许的工具名称字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
        自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
        必须处理 OAuth 授权流程并提供此处的令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
        关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

        当前支持的 `connector_id` 值包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google 日历： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook 日历： `connector_outlookcalendar`
        - Outlook 邮箱： `connector_outlookemail`
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

        此 MCP 工具是否延迟并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要批准。可以是
          `always`, `never`，或与需要批准的工具关联的筛选器对象
          。

          - `always: optional object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定单一批准策略。以下之一 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Realtime 响应状态

- `RealtimeResponseStatus object { error, reason, type }`

  有关状态的更多详细信息。

  - `error: optional object { code, type }`

    导致响应失败的错误描述，
    当 `status` 为 `failed`.

    - `code: optional string`

      错误代码（如有）。

    - `type: optional string`

      错误的类型。

  - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

    响应未完成的原因。对于 `cancelled` 响应，为以下之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，为以下之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器激活并截断了响应）。

    - `"turn_detected"`

    - `"client_cancelled"`

    - `"max_output_tokens"`

    - `"content_filter"`

  - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

    导致响应失败的错误类型，对应
    与 `status` 字段（`completed`, `cancelled`, `incomplete`,
    `failed`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

### Realtime 响应用量

- `RealtimeResponseUsage object { input_token_details, input_tokens, output_token_details, 2 more }`

  响应的使用统计，这将对应计费。一个
  Realtime API 会话将维护对话上下文并追加新的
  项目到对话中，因此前几轮的输出（文本和
  音频令牌）将成为后续轮次的输入。

  - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

    关于响应中使用的输入令牌的详细信息。缓存令牌是对话中前几轮的令牌，作为当前响应的上下文包含在内。这里的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和非缓存令牌。

    - `audio_tokens: optional number`

      作为 Response 输入使用的音频 token 数量。

    - `cached_tokens: optional number`

      作为 Response 输入使用的缓存 token 数量。

    - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

      作为 Response 输入使用的缓存 token 的详细信息。

      - `audio_tokens: optional number`

        作为 Response 输入使用的缓存音频 token 数量。

      - `image_tokens: optional number`

        作为 Response 输入使用的缓存图像 token 数量。

      - `text_tokens: optional number`

        作为 Response 输入使用的缓存文本 token 数量。

    - `image_tokens: optional number`

      作为 Response 输入使用的图像 token 数量。

    - `text_tokens: optional number`

      作为 Response 输入使用的文本 token 数量。

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

    Response 中的 token 总数，包括输入和输出
    文本和音频 token。

### Realtime 响应输入令牌详细信息

- `RealtimeResponseUsageInputTokenDetails object { audio_tokens, cached_tokens, cached_tokens_details, 2 more }`

  关于响应中使用的输入令牌的详细信息。缓存令牌是对话中前几轮的令牌，作为当前响应的上下文包含在内。这里的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和非缓存令牌。

  - `audio_tokens: optional number`

    作为 Response 输入使用的音频 token 数量。

  - `cached_tokens: optional number`

    作为 Response 输入使用的缓存 token 数量。

  - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

    作为 Response 输入使用的缓存 token 的详细信息。

    - `audio_tokens: optional number`

      作为 Response 输入使用的缓存音频 token 数量。

    - `image_tokens: optional number`

      作为 Response 输入使用的缓存图像 token 数量。

    - `text_tokens: optional number`

      作为 Response 输入使用的缓存文本 token 数量。

  - `image_tokens: optional number`

    作为 Response 输入使用的图像 token 数量。

  - `text_tokens: optional number`

    作为 Response 输入使用的文本 token 数量。

### Realtime 响应输出令牌详细信息

- `RealtimeResponseUsageOutputTokenDetails object { audio_tokens, text_tokens }`

  Response 中使用的输出 token 的详细信息。

  - `audio_tokens: optional number`

    Response 中使用的音频 token 数量。

  - `text_tokens: optional number`

    Response 中使用的文本 token 数量。

### Realtime 服务器事件

- `RealtimeServerEvent = ConversationCreatedEvent or ConversationItemCreatedEvent or ConversationItemDeletedEvent or 43 more`

  一个实时服务器事件。

  - `ConversationCreatedEvent object { conversation, event_id, type }`

    会话创建时返回。在会话创建后立即发出。

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

    当会话条目被创建时返回。有几种场景会产生此事件：

    - 服务器正在生成一个响应，如果成功将产生
      一个或两个条目，类型为 `message`
      （角色 `assistant`) 或类型 `function_call`.
    - 输入音频缓冲区已提交，由客户端或
      服务器（在 `server_vad` 模式下）。服务器将获取
      输入音频缓冲区的内容并添加到新的用户消息条目中。
    - 客户端已发送 `conversation.item.create` 事件以向对话添加新条目
      。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息，始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          所调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否已获批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          决策的可选原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 条目，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON 架构。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数的 JSON 字符串。

        - `name: string`

          所运行的工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          相关联的审批请求的 ID（如果有）。

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

        一个请求人工批准工具调用的 Realtime 项。

        - `id: string`

          该审批请求的唯一 ID。

        - `arguments: string`

          工具的 JSON 字符串参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发出请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.created"`

      事件类型，必须为 `conversation.item.created`.

      - `"conversation.item.created"`

    - `previous_item_id: optional string or null`

      会话上下文中前一个条目的 ID，允许
      客户端了解对话顺序。可以是 `null` 如果
      条目没有前驱。

  - `ConversationItemDeletedEvent object { event_id, item_id, type }`

    当对话中的某个条目被客户端通过某个
    `conversation.item.delete` 事件删除时返回此事件。该事件用于同步
    服务器对对话历史的理解与客户端的视图。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      被删除条目的 ID。

    - `type: "conversation.item.deleted"`

      事件类型，必须为 `conversation.item.deleted`.

      - `"conversation.item.deleted"`

  - `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

    此事件是将写入
    用户音频缓冲区的音频转录为文本的输出。当输入音频缓冲区被
    客户端或服务端（当 VAD 启用时）提交时，转录开始。转录与 Response 创建
    异步运行，因此此事件可能在 Response 事件之前或之后
    到达。

    Realtime API 模型原生支持音频输入，因此输入转录是
    在独立的 ASR（自动语音识别）模型上运行的独立过程。
    转录文本可能在一定程度上偏离模型的解读，
    应视为粗略参考。

    - `content_index: number`

      包含音频的内容部分的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      包含正在转录的音频的条目 ID。

    - `transcript: string`

      转录后的文本。

    - `type: "conversation.item.input_audio_transcription.completed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.completed`.

      - `"conversation.item.input_audio_transcription.completed"`

    - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      转录的使用统计信息，此费用按照 ASR 模型的定价而非实时模型的定价计费。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按 token 用量计费的模型的使用统计信息。

        - `input_tokens: number`

          此请求计费的输入 token 数量。

        - `output_tokens: number`

          生成的输出 token 数量。

        - `total_tokens: number`

          使用的 token 总数（输入 + 输出）。

        - `type: "tokens"`

          用量对象的类型。对于此变体，始终为 `tokens` 。

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          有关此请求计费的输入 token 的详细信息。

          - `audio_tokens: optional number`

            此请求计费的音频 token 数量。

          - `text_tokens: optional number`

            此请求计费的文本 token 数量。

      - `Duration object { seconds, type }`

        按音频输入时长计费的模型的使用统计信息。

        - `seconds: number`

          输入音频的时长（秒）。

        - `type: "duration"`

          用量对象的类型。对于此变体，始终为 `duration` 。

          - `"duration"`

    - `languages: optional array of TranscriptionLanguage`

      音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠检测到任何语言。

      - `code: string`

        音频中检测到的语言的代码。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。

      - `token: string`

        用于生成对数概率的 token。

      - `bytes: array of number`

        用于生成对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

    当输入音频转录内容部分的文本值被增量转录结果更新时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      包含正在转录的音频的条目 ID。

    - `type: "conversation.item.input_audio_transcription.delta"`

      事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

      - `"conversation.item.input_audio_transcription.delta"`

    - `content_index: optional number`

      内容部分在项目内容数组中的索引。

    - `delta: optional string`

      文本增量。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。这些可以通过配置会话启用 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应一个对数概率，表示此转录片段会选择哪个令牌。这有助于识别对于给定的转录片段是否存在多个有效选项的可能性。

      - `token: string`

        用于生成对数概率的 token。

      - `bytes: array of number`

        用于生成对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

    当配置了输入音频转录，且用户消息的转录
    请求失败时返回。这些事件与其它事件分开，
    `error` 以便客户端能识别相关的 Item。

    - `content_index: number`

      包含音频的内容部分的索引。

    - `error: object { code, message, param, type }`

      转录错误的详细信息。

      - `code: optional string`

        错误代码（如有）。

      - `message: optional string`

        人类可读的错误消息。

      - `param: optional string`

        与错误相关的参数（如有）。

      - `type: optional string`

        错误的类型。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      用户消息项的 ID。

    - `type: "conversation.item.input_audio_transcription.failed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.failed`.

      - `"conversation.item.input_audio_transcription.failed"`

  - `ConversationItemRetrieved object { event_id, item, type }`

    当检索对话条目时返回， `conversation.item.retrieve`。这用于获取条目的服务器表示，例如在噪声消除和 VAD 之后访问后处理的音频数据。它包含条目的完整内容，包括音频数据。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.retrieved"`

      事件类型，必须为 `conversation.item.retrieved`.

      - `"conversation.item.retrieved"`

  - `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

    当较早的助手音频消息条目被以下操作截断时返回
    客户端通过 `conversation.item.truncate` 事件。此事件用于
    同步服务器对音频的理解与客户端的播放。

    此操作将截断音频并移除服务端文本转录
    以确保上下文中不存在用户尚未听到的文本。

    - `audio_end_ms: number`

      音频被截断到的时长，以毫秒为单位。

    - `content_index: number`

      被截断的内容部分的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      被截断的助手消息条目的ID。

    - `type: "conversation.item.truncated"`

      事件类型，必须为 `conversation.item.truncated`.

      - `"conversation.item.truncated"`

  - `RealtimeErrorEvent object { error, event_id, type }`

    发生错误时返回，可能是客户端问题或服务器
    问题。大多数错误是可恢复的，会话将保持打开状态，我们
    建议实现方默认监控并记录错误消息。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        人类可读的错误消息。

      - `type: string`

        错误的类型（例如，"invalid_request_error"、"server_error"）。

      - `code: optional string or null`

        错误代码（如有）。

      - `event_id: optional string or null`

        导致错误的客户端事件的 event_id（如果适用）。

      - `param: optional string or null`

        与错误相关的参数（如有）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `InputAudioBufferClearedEvent object { event_id, type }`

    当客户端通过以下方式清除输入音频缓冲区时返回
    `input_audio_buffer.clear` 事件时。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "input_audio_buffer.cleared"`

      事件类型，必须为 `input_audio_buffer.cleared`.

      - `"input_audio_buffer.cleared"`

  - `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

    当输入音频缓冲区被提交时返回，无论是客户端还是
    在服务端 VAD 模式下自动触发。该 `item_id` 属性是用户
    消息项的 ID，该消息项将被创建，因此 `conversation.item.created` 事件
    也会发送给客户端。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      将被创建的用户消息项的 ID。

    - `type: "input_audio_buffer.committed"`

      事件类型，必须为 `input_audio_buffer.committed`.

      - `"input_audio_buffer.committed"`

    - `previous_item_id: optional string or null`

      新项目将插入其后的前一个项目的 ID。
      可以是 `null` 如果该项目没有前驱。

  - `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

    **仅限SIP：** 收到 DTMF 事件时返回。DTMF 事件是一种表示
    电话键盘按键（0–9、*、#、A–D）的消息。 `event` 属性
    是用户按下的键盘按键。 `received_at` 是服务器收到事件时的
    UTC Unix 时间戳。

    - `event: string`

      用户按下的电话键盘按键。

    - `received_at: number`

      服务器收到 DTMF 事件时的 UTC Unix 时间戳。

    - `type: "input_audio_buffer.dtmf_event_received"`

      事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

      - `"input_audio_buffer.dtmf_event_received"`

  - `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

    当处于 `server_vad` 模式时，服务器发送此事件，表示在
    音频缓冲区中检测到语音。只要音频被添加到
    缓冲区（除非已经检测到语音），就可能发生这种情况。客户端可能希望使用此
    事件来中断音频播放或向用户提供视觉反馈。

    客户端应期望在语音停止时收到 `input_audio_buffer.speech_stopped` 事件
    。当语音停止时， `item_id` 属性是将要创建的用户消息项
    的 ID，该消息项也会包含在
    `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
    音频缓冲区）。

    - `audio_start_ms: number`

      从会话期间写入缓冲区的所有音频开始计算，首次检测到语音的毫秒数。这将对应于
      发送给模型的音频开始时间，因此包含了
      在会话中配置的
      `prefix_padding_ms` 。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      语音停止时将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_started"`

      事件类型，必须为 `input_audio_buffer.speech_started`.

      - `"input_audio_buffer.speech_started"`

  - `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

    在 `server_vad` 模式下，当服务器检测到
    音频缓冲区中的语音结束时，将返回该值。服务器还会发送 `conversation.item.created`
    一个事件，包含从音频缓冲区创建的用户消息项目。

    - `audio_end_ms: number`

      语音停止时自会话开始以来的毫秒数。这
      对应于发送给模型的音频结束时间，因此包括
      `min_silence_duration_ms` 。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      将被创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_stopped"`

      事件类型，必须为 `input_audio_buffer.speech_stopped`.

      - `"input_audio_buffer.speech_stopped"`

  - `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

    在 Response 开始时发出，以指示更新的速率限制。
    创建 Response 时，一些令牌将被“保留”用于输出
    令牌，此处显示的速率限制反映了该保留，随后在
    Response 完成时相应调整。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `rate_limits: array of object { limit, name, remaining, reset_seconds }`

      速率限制信息列表。

      - `limit: optional number`

        速率限制允许的最大值。

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

      内容部分在项目内容数组中的索引。

    - `delta: string`

      Base64 编码的音频数据增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.delta"`

      事件类型，必须为 `response.output_audio.delta`.

      - `"response.output_audio.delta"`

  - `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

    当模型生成的音频完成时返回。当响应
    被中断、不完整或取消时也会触发。

    - `content_index: number`

      内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.done"`

      事件类型，必须为 `response.output_audio.done`.

      - `"response.output_audio.done"`

  - `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

    当模型生成的音频输出转录更新时返回。

    - `content_index: number`

      内容部分在项目内容数组中的索引。

    - `delta: string`

      转录增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio_transcript.delta"`

      事件类型，必须为 `response.output_audio_transcript.delta`.

      - `"response.output_audio_transcript.delta"`

  - `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

    当模型生成的音频输出转录流式传输完成时返回。当响应被中断、不完整或
    流式传输。当响应被中断、不完整或
    取消时也会触发。

    - `content_index: number`

      内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `transcript: string`

      音频的最终转录。

    - `type: "response.output_audio_transcript.done"`

      事件类型，必须为 `response.output_audio_transcript.done`.

      - `"response.output_audio_transcript.done"`

  - `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

    当在响应生成期间向助理消息条目添加新的内容部分时返回
    。

    - `content_index: number`

      内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      添加内容部分的条目的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `part: object { audio, text, transcript, type }`

      添加的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果 type 为 "audio"）。

      - `text: optional string`

        文本内容（如果 type 为 "text"）。

      - `transcript: optional string`

        音频的转写文本（如果 type 为 "audio"）。

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
    当响应被中断、不完整或取消时也会发出。

    - `content_index: number`

      内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `part: object { audio, text, transcript, type }`

      已完成的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果 type 为 "audio"）。

      - `text: optional string`

        文本内容（如果 type 为 "text"）。

      - `transcript: optional string`

        音频的转写文本（如果 type 为 "audio"）。

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

    当创建新响应时返回。响应创建的第一个事件，
    此时响应处于初始状态 `in_progress`.

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

      - `id: optional string`

        响应的唯一 ID，格式类似于 `resp_1234`.

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

            模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
            便无法更改。当前
            可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
              便无法更改。当前
              可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

        响应被添加到的会话，由事件中的 `conversation`
        字段决定。如果 `response.create` ，则响应不会 `auto`，被添加到任何会话，且
        的值将为 `conversation_id` 。如果响应是由 VAD
        `conv_1234`。的 `none`，自动触发的，则响应将被添加到默认会话，且
        的值将为 `conversation_id` 将为 `null`。如果响应正在被
        自动触发，则响应将被添加到默认会话

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出令牌数，
        （包括工具调用），用于此响应。

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        可附加到对象上的 16 个键值对集合。这可用于
        以结构化格式存储关于对象的附加信息，
        并通过 API 或仪表板查询对象。

        键是字符串，最大长度为 64 个字符。值是字符串，
        最大长度为 512 个字符。

      - `object: optional "realtime.response"`

        对象类型，必须为 `realtime.response`.

        - `"realtime.response"`

      - `output: optional array of ConversationItem`

        响应生成的输出项列表。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

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

          一个 Realtime 条目，列出 MCP 服务器上可用的工具。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          一个请求人工批准工具调用的 Realtime 项。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前唯一可能的值是
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        输出设置为模式 `text` 将禁用模型的音频输出。

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
          当 `status` 为 `failed`.

          - `code: optional string`

            错误代码（如有）。

          - `type: optional string`

            错误的类型。

        - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

          响应未完成的原因。对于 `cancelled` 响应，为以下之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，为以下之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器激活并截断了响应）。

          - `"turn_detected"`

          - `"client_cancelled"`

          - `"max_output_tokens"`

          - `"content_filter"`

        - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

          导致响应失败的错误类型，对应
          与 `status` 字段（`completed`, `cancelled`, `incomplete`,
          `failed`).

          - `"completed"`

          - `"cancelled"`

          - `"failed"`

          - `"incomplete"`

      - `usage: optional RealtimeResponseUsage`

        响应的使用统计，这将对应计费。一个
        Realtime API 会话将维护对话上下文并追加新的
        项目到对话中，因此前几轮的输出（文本和
        音频令牌）将成为后续轮次的输入。

        - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

          关于响应中使用的输入令牌的详细信息。缓存令牌是对话中前几轮的令牌，作为当前响应的上下文包含在内。这里的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和非缓存令牌。

          - `audio_tokens: optional number`

            作为 Response 输入使用的音频 token 数量。

          - `cached_tokens: optional number`

            作为 Response 输入使用的缓存 token 数量。

          - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

            作为 Response 输入使用的缓存 token 的详细信息。

            - `audio_tokens: optional number`

              作为 Response 输入使用的缓存音频 token 数量。

            - `image_tokens: optional number`

              作为 Response 输入使用的缓存图像 token 数量。

            - `text_tokens: optional number`

              作为 Response 输入使用的缓存文本 token 数量。

          - `image_tokens: optional number`

            作为 Response 输入使用的图像 token 数量。

          - `text_tokens: optional number`

            作为 Response 输入使用的文本 token 数量。

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

          Response 中的 token 总数，包括输入和输出
          文本和音频 token。

    - `type: "response.created"`

      事件类型，必须为 `response.created`.

      - `"response.created"`

  - `ResponseDoneEvent object { event_id, response, type }`

    当响应完成流式传输时返回。无论最终状态如何，始终会发出。
    事件中包含的 Response 对象将 `response.done` 包含
    响应中的所有输出项，但会省略原始音频数据。

    客户端应检查响应的 `status` 字段以确定是否成功
    (`completed`）或是否有其他结果： `cancelled`, `failed`，或 `incomplete`.

    响应将包含响应期间生成的所有输出项，不包括
    任何音频内容。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

    - `type: "response.done"`

      事件类型，必须为 `response.done`.

      - `"response.done"`

  - `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

    当模型生成的函数调用参数更新时返回。

    - `call_id: string`

      函数调用的 ID。

    - `delta: string`

      以 JSON 字符串形式表示的参数增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.function_call_arguments.delta"`

      事件类型，必须为 `response.function_call_arguments.delta`.

      - `"response.function_call_arguments.delta"`

  - `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

    当模型生成的函数调用参数完成流式传输时返回。
    当响应被中断、不完整或取消时也会发出。

    - `arguments: string`

      最终参数，以 JSON 字符串形式表示。

    - `call_id: string`

      函数调用的 ID。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `name: string`

      所调用函数的名称。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.function_call_arguments.done"`

      事件类型，必须为 `response.function_call_arguments.done`.

      - `"response.function_call_arguments.done"`

  - `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

    当 Response 生成期间创建新 Item 时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

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

    当 Item 完成流式传输时返回。当 Response 被
    中断、不完整或取消时也会发出。

    - `event_id: string`

      服务器事件的唯一 ID。

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

      内容部分在项目内容数组中的索引。

    - `delta: string`

      文本增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_text.delta"`

      事件类型，必须为 `response.output_text.delta`.

      - `"response.output_text.delta"`

  - `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

    当 "output_text" 内容部分的文本值完成流式传输时返回。当
    Response 被中断、不完整或取消时也会发出。

    - `content_index: number`

      内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `text: string`

      最终文本内容。

    - `type: "response.output_text.done"`

      事件类型，必须为 `response.output_text.done`.

      - `"response.output_text.done"`

  - `SessionCreatedEvent object { event_id, session, type }`

    当创建 Session 时返回。当建立新的
    连接作为第一个服务器事件时自动发出。此事件将包含
    默认的 Session 配置。

    - `event_id: string`

      服务器事件的唯一 ID。

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

          要创建的会话类型。始终 `realtime` 用于 Realtime API。

          - `"realtime"`

        - `audio: optional object { input, output }`

          输入和输出音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪配置。可设置为 `null` 以关闭。
              降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
              过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional object { language, languages, model, prompt }`

              输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

              语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

              语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

                  如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选超时时间，超过该时间后会自动触发模型响应。这
                  对于用户长时间停顿属于意外情况（如电话
                  通话）时非常有用。模型将根据当前上下文提示用户继续对话
                  。

                  超时值将在最后一条模型响应的音频播放完毕后应用，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  （与响应关联的）将在达到超时时间时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
                  会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

                  如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
                  毫秒为单位）。默认为 300 毫秒。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
                  为 500 毫秒。值越短，模型响应越快，
                  但可能会在用户短暂停顿时抢话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                  阈值越高，需要更响亮的音频才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来确定用户何时说完话。

                - `type: "semantic_vad"`

                  轮转检测的类型， `semantic_vad` 以开启语义 VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在 VAD 开始事件发生时自动中断任何输出到默认
                  会话（即。 `conversation` 的 `auto`）的进行中的响应。

          - `output: optional object { format, speed, voice }`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型口语响应速度相对于原始速度的倍数。
              1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

              此参数是音频生成后的后处理调整，它
              也可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
              便无法更改。当前
              可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
              最佳质量。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
                便无法更改。当前
                可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
                `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

          会话的过期时间戳，以自纪元以来的秒数表示。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          服务器输出中包含的其他字段。

          `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

          请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单个助手响应的最大输出令牌数，
          包括工具调用。提供一个介于 1 和 4096 之间的整数，以
          限制输出令牌，或 `inf` 用于获取给定模型的
          最大可用令牌。默认为 `inf`.

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
          模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
          模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

          - `"text"`

          - `"audio"`

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

          - `id: string`

            要使用的提示模板的唯一标识符。

          - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

            可选的值映射，用于替换你的
            提示中的变量。替换值可以是字符串，也可以是其他
            响应输入类型，如图像或文件。

            - `string`

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              给模型的文本输入。

              - `text: string`

                给模型的文本输入。

              - `type: "input_text"`

                输入项的类型。始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

              - `detail: ImageDetail`

                发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

                - `"low"`

                - `"high"`

                - `"auto"`

                - `"original"`

              - `type: "input_image"`

                输入项的类型。始终为 `input_image`.

                - `"input_image"`

              - `file_id: optional string or null`

                要发送给模型的文件的 ID。

              - `image_url: optional string or null`

                要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string`

                要发送给模型的文件的内容。

              - `file_id: optional string or null`

                要发送给模型的文件的 ID。

              - `file_url: optional string`

                要发送给模型的文件的 URL。

              - `filename: optional string`

                要发送给模型的文件的名称。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

          - `version: optional string or null`

            提示模板的可选版本。

        - `reasoning: optional RealtimeReasoning`

          支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

          - `effort: optional RealtimeReasoningEffort`

            限制支持推理的 Realtime 模型（例如）的推理投入
            `gpt-realtime-2`.

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

        - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

          模型如何选择工具。提供一种字符串模式，或强制指定某个
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪个（如果有）工具。

            `none` 表示模型不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息或调用一个或多个
            工具之间进行选择。

            `required` 表示模型必须调用一个或多个工具。

            - `"none"`

            - `"auto"`

            - `"required"`

          - `ToolChoiceFunction object { name, type }`

            使用此选项强制模型调用特定函数。

            - `name: string`

              要调用的函数的名称。

            - `type: "function"`

              对于函数调用，类型始终为 `function`.

              - `"function"`

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
              调用它的指导，以及在调用时该告诉用户什么的指导
              （如果有的话）。

            - `name: optional string`

              函数的名称。

            - `parameters: optional unknown`

              JSON Schema 中函数的参数。

            - `type: optional "function"`

              该工具的类型，即 `function`.

              - `"function"`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol 让模型访问额外工具
            (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

              允许的工具名称列表或筛选对象。

              - `McpAllowedTools = array of string`

                允许的工具名称字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
              自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
              必须处理 OAuth 授权流程并提供此处的令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
              关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

              当前支持的 `connector_id` 值包括：

              - Dropbox： `connector_dropbox`
              - Gmail： `connector_gmail`
              - Google 日历： `connector_googlecalendar`
              - Google Drive： `connector_googledrive`
              - Microsoft Teams： `connector_microsoftteams`
              - Outlook 日历： `connector_outlookcalendar`
              - Outlook 邮箱： `connector_outlookemail`
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

              此 MCP 工具是否延迟并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要批准。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要批准。可以是
                `always`, `never`，或与需要批准的工具关联的筛选器对象
                。

                - `always: optional object { read_only, tool_names }`

                  指定允许哪些工具的筛选对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或为只读。如果
                    MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此筛选条件。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  指定允许哪些工具的筛选对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或为只读。如果
                    MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此筛选条件。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一批准策略。以下之一 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

          Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
          为会话启用了 追踪，配置便无法修改。

          `auto` 将为会话创建带有默认值的 追踪，用于
          工作流名称、组 ID 和元数据。

          - `Auto = "auto"`

            启用追踪并为追踪配置选项设置默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            追踪的精细配置。

            - `group_id: optional string`

              要附加到此追踪的组 ID，以启用过滤和
              在追踪仪表板中进行分组。

            - `metadata: optional unknown`

              要附加到此追踪的任意元数据，以启用
              在追踪仪表板中进行过滤。

            - `workflow_name: optional string`

              要附加到此追踪的工作流名称。此名称用于
              在追踪仪表板中命名此追踪。

        - `truncation: optional RealtimeTruncation`

          当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

          客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

          截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

          可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

          - `"auto" or "disabled"`

            用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

            - `retention_ratio: number`

              当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

              - `post_instructions: optional number`

                指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

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

          会话输入音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `transcription: optional object { language, languages, model, prompt }`

              转录模型的配置。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
              VAD 表示模型将根据
              音频音量检测语音的开始和结束，并在用户语音结束时响应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

              - `prefix_padding_ms: optional number`

                在 VAD 检测到语音之前包含的音频量（以
                毫秒为单位）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                检测语音停止的静音持续时间（以毫秒为单位）。默认为
                为 500 毫秒。值越短，模型响应越快，
                但可能会在用户短暂停顿时抢话。

              - `threshold: optional number`

                VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
                阈值越高，需要更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

              - `type: optional string`

                轮次检测的类型，仅限 `server_vad` 当前已支持。

        - `expires_at: optional number`

          会话的过期时间戳，以自纪元以来的秒数表示。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          服务器输出中包含的其他字段。

          - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `SessionUpdatedEvent object { event_id, session, type }`

    当会话以 `session.update` 事件更新时返回，除非
    发生错误。

    - `event_id: string`

      服务器事件的唯一 ID。

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

    **仅 WebRTC/SIP：** 当服务器开始向客户端流式传输音频时发出。此事件在
    音频内容部分已添加到响应（`response.content_part.added`)
    后发出。
    [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response_id: string`

      生成音频的响应的唯一 ID。

    - `type: "output_audio_buffer.started"`

      事件类型，必须为 `output_audio_buffer.started`.

      - `"output_audio_buffer.started"`

  - `OutputAudioBufferStopped object { event_id, response_id, type }`

    **仅 WebRTC/SIP：** 当服务器上的输出音频缓冲区已完全排空，且不再有音频即将到达时发出。
    此事件在完整响应
    数据已发送到客户端之后发出（`response.done`).
    [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response_id: string`

      生成音频的响应的唯一 ID。

    - `type: "output_audio_buffer.stopped"`

      事件类型，必须为 `output_audio_buffer.stopped`.

      - `"output_audio_buffer.stopped"`

  - `OutputAudioBufferCleared object { event_id, response_id, type }`

    **仅 WebRTC/SIP：** 当输出音频缓冲区被清除时发出。这发生在 VAD
    模式下用户中断时（`input_audio_buffer.speech_started`),
    或当客户端已发出 `output_audio_buffer.clear` 事件来手动
    切断当前音频响应时。
    [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response_id: string`

      生成音频的响应的唯一 ID。

    - `type: "output_audio_buffer.cleared"`

      事件类型，必须为 `output_audio_buffer.cleared`.

      - `"output_audio_buffer.cleared"`

  - `ConversationItemAdded object { event_id, item, type, previous_item_id }`

    当某项（Item）被添加到默认对话（Conversation）时，服务器会发送此消息。这可能发生在以下几种情况：

    - 当客户端发送 `conversation.item.create` 事件时。
    - 当输入音频缓冲区被提交时。在这种情况下，该项将是一条包含缓冲区音频的用户消息。
    - 当模型正在生成响应（Response）时。在这种情况下， `conversation.item.added` 当模型开始生成特定项时，将发送该事件，因此它此时尚不包含任何内容（且 `status` 将为 `in_progress`).

    该事件将包含该项的完整内容（模型正在生成响应时除外），但音频数据除外，音频数据可以通过 `conversation.item.retrieve` 事件单独获取，如有必要。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.added"`

      事件类型，必须为 `conversation.item.added`.

      - `"conversation.item.added"`

    - `previous_item_id: optional string or null`

      前一项的 ID（如果存在）。这用于在插入项时
      维护顺序。

  - `ConversationItemDone object { event_id, item, type, previous_item_id }`

    当会话项最终确定时返回。

    该事件将包含除音频数据外的完整项内容，音频数据可以稍后通过 `conversation.item.retrieve` 事件单独获取。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.done"`

      事件类型，必须为 `conversation.item.done`.

      - `"conversation.item.done"`

    - `previous_item_id: optional string or null`

      前一项的 ID（如果存在）。这用于在插入项时
      维护顺序。

  - `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

    当输入音频缓冲区触发服务器端 VAD 超时时返回。这是通过
    配置的 `idle_timeout_ms` 在会话的 `turn_detection` 设置中，它表示
    在配置的持续时间内未检测到任何语音。

    该 `audio_start_ms` 以及 `audio_end_ms` 字段表示从最后一次
    模型响应到触发时的音频片段，作为从写入的音频开头开始的偏移量
    到输入音频缓冲区。这意味着它划定了静音的音频片段，并且
    开始和结束值之间的差异将大致匹配配置的超时时间。

    空音频将作为 `input_audio` 项提交到对话中（将会有
    `input_audio_buffer.committed` 事件），并生成模型响应。可能存在
    未触发 VAD 但模型仍检测到的语音，因此模型可能回应
    与对话相关的内容或提示继续说话。

    - `audio_end_ms: number`

      超时触发时写入输入音频缓冲区的音频的毫秒偏移量。

    - `audio_start_ms: number`

      写入输入音频缓冲区的音频的毫秒偏移量，该缓冲区位于最后一次模型响应的播放时间之后。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      与此段关联的项目的 ID。

    - `type: "input_audio_buffer.timeout_triggered"`

      事件类型，必须为 `input_audio_buffer.timeout_triggered`.

      - `"input_audio_buffer.timeout_triggered"`

  - `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

    当输入音频转录片段被识别为某个条目时返回。

    - `id: string`

      片段标识符。

    - `content_index: number`

      条目内输入音频内容部分的索引。

    - `end: number`

      片段的结束时间（秒）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      包含输入音频内容的条目的ID。

    - `speaker: string`

      此片段的检测到的说话者标签。

    - `start: number`

      片段的开始时间（秒）。

    - `text: string`

      此片段的文本。

    - `type: "conversation.item.input_audio_transcription.segment"`

      事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

      - `"conversation.item.input_audio_transcription.segment"`

  - `McpListToolsInProgress object { event_id, item_id, type }`

    当正在为某个项目列出 MCP 工具时返回此结果。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具列表条目的 ID。

    - `type: "mcp_list_tools.in_progress"`

      事件类型，必须为 `mcp_list_tools.in_progress`.

      - `"mcp_list_tools.in_progress"`

  - `McpListToolsCompleted object { event_id, item_id, type }`

    当某个条目的 MCP 工具列表操作完成时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具列表条目的 ID。

    - `type: "mcp_list_tools.completed"`

      事件类型，必须为 `mcp_list_tools.completed`.

      - `"mcp_list_tools.completed"`

  - `McpListToolsFailed object { event_id, item_id, type }`

    当某个项目列出 MCP 工具失败时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具列表条目的 ID。

    - `type: "mcp_list_tools.failed"`

      事件类型，必须为 `mcp_list_tools.failed`.

      - `"mcp_list_tools.failed"`

  - `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

    当响应生成期间 MCP 工具调用参数更新时返回。

    - `delta: string`

      JSON 编码的参数增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.mcp_call_arguments.delta"`

      事件类型，必须为 `response.mcp_call_arguments.delta`.

      - `"response.mcp_call_arguments.delta"`

    - `obfuscation: optional string or null`

      如果存在，表示增量文本已被混淆。

  - `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

    在响应生成过程中完成 MCP 工具调用参数时返回。

    - `arguments: string`

      最终 JSON 编码的参数字符串。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.mcp_call_arguments.done"`

      事件类型，必须为 `response.mcp_call_arguments.done`.

      - `"response.mcp_call_arguments.done"`

  - `ResponseMcpCallInProgress object { event_id, item_id, output_index, type }`

    当 MCP 工具调用已开始且正在进行时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `type: "response.mcp_call.in_progress"`

      事件类型，必须为 `response.mcp_call.in_progress`.

      - `"response.mcp_call.in_progress"`

  - `ResponseMcpCallCompleted object { event_id, item_id, output_index, type }`

    当 MCP 工具调用成功完成时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `type: "response.mcp_call.completed"`

      事件类型，必须为 `response.mcp_call.completed`.

      - `"response.mcp_call.completed"`

  - `ResponseMcpCallFailed object { event_id, item_id, output_index, type }`

    当 MCP 工具调用失败时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      输出条目在响应中的索引。

    - `type: "response.mcp_call.failed"`

      事件类型，必须为 `response.mcp_call.failed`.

      - `"response.mcp_call.failed"`

### 实时会话

- `RealtimeSession object { id, expires_at, include, 17 more }`

  测试版接口的实时会话对象。

  - `id: optional string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元以来的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    服务器输出中包含的其他字段。

    - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输入音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`，输入音频必须是 24kHz 采样率、16 位 PCM、
    单声道（mono）且为小端字节序。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `input_audio_noise_reduction: optional object { type }`

    输入音频降噪配置。可设置为 `null` 以关闭。
    降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
    过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `input_audio_transcription: optional object { language, languages, model, prompt }  or null`

    输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](https://platform.openai.com/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

    默认系统指令（即系统消息）会在模型调用前添加。
    此字段允许客户端引导模型产生预期的
    响应。可以指导模型关于响应内容和格式，
    （例如“要极其简洁”、“要友好”、“这里有一些好响应的例子”
    ）以及音频行为（例如“说话快一点”、“在语音中注入情感”、
    “多笑”）。这些指令不保证会被模型遵循，
    但为模型提供预期行为的指导。
    注意，服务器会设置默认指令，如果此字段未设置，将使用这些默认指令，

    并且它们会在会话开始时的
    事件中可见。 `session.created` 事件中可见。
    事件中可见。

  - `max_response_output_tokens: optional number or "inf"`

    单个助手响应的最大输出令牌数，
    包括工具调用。提供一个介于 1 和 4096 之间的整数，以
    限制输出令牌，或 `inf` 用于获取给定模型的
    最大可用令牌。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。要禁用音频，
    设置为 ["text"]。

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

    输出音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`，输出音频的采样率为 24kHz。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的值映射，用于替换你的
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        给模型的文本输入。

        - `text: string`

          给模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送给模型的文件的 ID。

        - `image_url: optional string or null`

          要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送给模型的文件的内容。

        - `file_id: optional string or null`

          要发送给模型的文件的 ID。

        - `file_url: optional string`

          要发送给模型的文件的 URL。

        - `filename: optional string`

          要发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `speed: optional number`

    模型语音回复的速度。1.0 为默认速度。0.25 是
    最低速度。1.5 为最高速度。此值只能在
    模型回合之间更改，不能在回复进行中更改。

  - `temperature: optional number`

    模型的采样温度，限制在 [0.6, 1.2] 内。对于音频模型，强烈建议使用 0.8 的温度以获得最佳性能。

  - `tool_choice: optional string`

    模型选择工具的方式。选项为 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    可供模型使用的工具（函数）。

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指导，以及在调用时该告诉用户什么的指导
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      JSON Schema 中函数的参数。

    - `type: optional "function"`

      该工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    追踪的配置选项。设置为 null 以禁用追踪。一旦
    为会话启用了 追踪，配置便无法修改。

    `auto` 将为会话创建带有默认值的 追踪，用于
    工作流名称、组 ID 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的精细配置。

      - `group_id: optional string`

        要附加到此追踪的组 ID，以启用过滤和
        在追踪仪表板中分组。

      - `metadata: optional unknown`

        要附加到此追踪的任意元数据，以启用
        在追踪仪表板中过滤。

      - `workflow_name: optional string`

        要附加到此追踪的工作流名称。此名称用于
        在追踪仪表板中为追踪命名。

  - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

    语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

    语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

      - `type: "server_vad"`

        轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

        如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选超时时间，超过该时间后会自动触发模型响应。这
        对于用户长时间停顿属于意外情况（如电话
        通话）时非常有用。模型将根据当前上下文提示用户继续对话
        。

        超时值将在最后一条模型响应的音频播放完毕后应用，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        （与响应关联的）将在达到超时时间时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
        会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

        如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
        毫秒为单位）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
        为 500 毫秒。值越短，模型响应越快，
        但可能会在用户短暂停顿时抢话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
        阈值越高，需要更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来确定用户何时说完话。

      - `type: "semantic_vad"`

        轮转检测的类型， `semantic_vad` 以开启语义 VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在 VAD 开始事件发生时自动中断任何输出到默认
        会话（即。 `conversation` 的 `auto`）的进行中的响应。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

    模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
    便无法更改。当前
    可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
    `shimmer`，以及 `verse`.

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
      便无法更改。当前
      可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

### Realtime 会话创建请求

- `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

  Realtime 会话对象配置。

  - `type: "realtime"`

    要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

        输入音频降噪配置。可设置为 `null` 以关闭。
        降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
        过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转写文本前等待的时间。
          值越高可以提高转写准确度，但会增加延迟。
          仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在以下位置提供输入语言：
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          将提高准确度和降低延迟。

        - `languages: optional array of string`

          输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          可选的文本，用于指导模型的风格或延续先前的音频
          片段。
          对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
          提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

      - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

        语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

        语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

          - `type: "server_vad"`

            轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

            如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选超时时间，超过该时间后会自动触发模型响应。这
            对于用户长时间停顿属于意外情况（如电话
            通话）时非常有用。模型将根据当前上下文提示用户继续对话
            。

            超时值将在最后一条模型响应的音频播放完毕后应用，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            （与响应关联的）将在达到超时时间时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
            会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

            如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
            毫秒为单位）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
            为 500 毫秒。值越短，模型响应越快，
            但可能会在用户短暂停顿时抢话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
            阈值越高，需要更响亮的音频才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来确定用户何时说完话。

          - `type: "semantic_vad"`

            轮转检测的类型， `semantic_vad` 以开启语义 VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在 VAD 开始事件发生时自动中断任何输出到默认
            会话（即。 `conversation` 的 `auto`）的进行中的响应。

    - `output: optional RealtimeAudioConfigOutput`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型口语响应速度相对于原始速度的倍数。
        1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

        此参数是音频生成后的后处理调整，它
        也可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于响应的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
        一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
        。
        我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

    服务器输出中包含的其他字段。

    `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

    请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出令牌数，
    包括工具调用。提供一个介于 1 和 4096 之间的整数，以
    限制输出令牌，或 `inf` 用于获取给定模型的
    最大可用令牌。默认为 `inf`.

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
    模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
    模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅受
    推理 Realtime 模型（如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的值映射，用于替换你的
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        给模型的文本输入。

        - `text: string`

          给模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送给模型的文件的 ID。

        - `image_url: optional string or null`

          要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送给模型的文件的内容。

        - `file_id: optional string or null`

          要发送给模型的文件的 ID。

        - `file_url: optional string`

          要发送给模型的文件的 URL。

        - `filename: optional string`

          要发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如）的推理投入
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional RealtimeToolChoiceConfig`

    模型如何选择工具。提供一种字符串模式，或强制指定某个
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个（如果有）工具。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或多个
      工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项强制模型调用特定函数。

      - `name: string`

        要调用的函数的名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
        调用它的指导，以及在调用时该告诉用户什么的指导
        （如果有的话）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        JSON Schema 中函数的参数。

      - `type: optional "function"`

        该工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol 让模型访问额外工具
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

        允许的工具名称列表或筛选对象。

        - `McpAllowedTools = array of string`

          允许的工具名称字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
        自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
        必须处理 OAuth 授权流程并提供此处的令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
        关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

        当前支持的 `connector_id` 值包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google 日历： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook 日历： `connector_outlookcalendar`
        - Outlook 邮箱： `connector_outlookemail`
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

        此 MCP 工具是否延迟并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要批准。可以是
          `always`, `never`，或与需要批准的工具关联的筛选器对象
          。

          - `always: optional object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定单一批准策略。以下之一 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `tracing: optional RealtimeTracingConfig or null`

    Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
    为会话启用了 追踪，配置便无法修改。

    `auto` 将为会话创建带有默认值的 追踪，用于
    工作流名称、组 ID 和元数据。

    - `Auto = "auto"`

      启用追踪并为追踪配置选项设置默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的精细配置。

      - `group_id: optional string`

        要附加到此追踪的组 ID，以启用过滤和
        在追踪仪表板中进行分组。

      - `metadata: optional unknown`

        要附加到此追踪的任意元数据，以启用
        在追踪仪表板中进行过滤。

      - `workflow_name: optional string`

        要附加到此追踪的工作流名称。此名称用于
        在追踪仪表板中命名此追踪。

  - `truncation: optional RealtimeTruncation`

    当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

    客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

    截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

    可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

    - `"auto" or "disabled"`

      用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

      - `retention_ratio: number`

        当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

        - `post_instructions: optional number`

          指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

### Realtime 工具选择配置

- `RealtimeToolChoiceConfig = ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

  模型如何选择工具。提供一种字符串模式，或强制指定某个
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个（如果有）工具。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或多个
    工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项强制模型调用特定函数。

    - `name: string`

      要调用的函数的名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项强制模型调用远程 MCP 服务器上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务器的标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具名称。

### Realtime 工具配置

- `RealtimeToolsConfig = array of RealtimeToolsConfigUnion`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指导，以及在调用时该告诉用户什么的指导
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      JSON Schema 中函数的参数。

    - `type: optional "function"`

      该工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol 让模型访问额外工具
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

      允许的工具名称列表或筛选对象。

      - `McpAllowedTools = array of string`

        允许的工具名称字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        指定允许哪些工具的筛选对象。

        - `read_only: optional boolean`

          指示工具是否修改数据或为只读。如果
          MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此筛选条件。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
      自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
      必须处理 OAuth 授权流程并提供此处的令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
      关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

      当前支持的 `connector_id` 值包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google 日历： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook 日历： `connector_outlookcalendar`
      - Outlook 邮箱： `connector_outlookemail`
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

      此 MCP 工具是否延迟并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要批准。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要批准。可以是
        `always`, `never`，或与需要批准的工具关联的筛选器对象
        。

        - `always: optional object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一批准策略。以下之一 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Realtime 工具配置联合类型

- `RealtimeToolsConfigUnion = RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

  通过远程 Model Context Protocol 让模型访问额外工具
  (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指导，以及在调用时该告诉用户什么的指导
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      JSON Schema 中函数的参数。

    - `type: optional "function"`

      该工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol 让模型访问额外工具
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

      允许的工具名称列表或筛选对象。

      - `McpAllowedTools = array of string`

        允许的工具名称字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        指定允许哪些工具的筛选对象。

        - `read_only: optional boolean`

          指示工具是否修改数据或为只读。如果
          MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此筛选条件。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
      自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
      必须处理 OAuth 授权流程并提供此处的令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
      关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

      当前支持的 `connector_id` 值包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google 日历： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook 日历： `connector_outlookcalendar`
      - Outlook 邮箱： `connector_outlookemail`
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

      此 MCP 工具是否延迟并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要批准。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要批准。可以是
        `always`, `never`，或与需要批准的工具关联的筛选器对象
        。

        - `always: optional object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一批准策略。以下之一 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Realtime 追踪配置

- `RealtimeTracingConfig = "auto" or object { group_id, metadata, workflow_name }`

  Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
  为会话启用了 追踪，配置便无法修改。

  `auto` 将为会话创建带有默认值的 追踪，用于
  工作流名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并为追踪配置选项设置默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的精细配置。

    - `group_id: optional string`

      要附加到此追踪的组 ID，以启用过滤和
      在追踪仪表板中进行分组。

    - `metadata: optional unknown`

      要附加到此追踪的任意元数据，以启用
      在追踪仪表板中进行过滤。

    - `workflow_name: optional string`

      要附加到此追踪的工作流名称。此名称用于
      在追踪仪表板中命名此追踪。

### Realtime 转录会话音频

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

      输入音频降噪配置。可设置为 `null` 以关闭。
      降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
      过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本前等待的时间。
        值越高可以提高转写准确度，但会增加延迟。
        仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在以下位置提供输入语言：
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        将提高准确度和降低延迟。

      - `languages: optional array of string`

        输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于指导模型的风格或延续先前的音频
        片段。
        对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
        提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

      语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

      语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

        - `type: "server_vad"`

          轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

          如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选超时时间，超过该时间后会自动触发模型响应。这
          对于用户长时间停顿属于意外情况（如电话
          通话）时非常有用。模型将根据当前上下文提示用户继续对话
          。

          超时值将在最后一条模型响应的音频播放完毕后应用，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          （与响应关联的）将在达到超时时间时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
          会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

          如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
          毫秒为单位）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
          为 500 毫秒。值越短，模型响应越快，
          但可能会在用户短暂停顿时抢话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
          阈值越高，需要更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来确定用户何时说完话。

        - `type: "semantic_vad"`

          轮转检测的类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在 VAD 开始事件发生时自动中断任何输出到默认
          会话（即。 `conversation` 的 `auto`）的进行中的响应。

### Realtime 转录会话音频输入

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

    输入音频降噪配置。可设置为 `null` 以关闭。
    降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
    过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转写文本前等待的时间。
      值越高可以提高转写准确度，但会增加延迟。
      仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在以下位置提供输入语言：
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      将提高准确度和降低延迟。

    - `languages: optional array of string`

      输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      可选的文本，用于指导模型的风格或延续先前的音频
      片段。
      对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
      提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

  - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

    语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

    语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

      - `type: "server_vad"`

        轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

        如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选超时时间，超过该时间后会自动触发模型响应。这
        对于用户长时间停顿属于意外情况（如电话
        通话）时非常有用。模型将根据当前上下文提示用户继续对话
        。

        超时值将在最后一条模型响应的音频播放完毕后应用，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        （与响应关联的）将在达到超时时间时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
        会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

        如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
        毫秒为单位）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
        为 500 毫秒。值越短，模型响应越快，
        但可能会在用户短暂停顿时抢话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
        阈值越高，需要更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来确定用户何时说完话。

      - `type: "semantic_vad"`

        轮转检测的类型， `semantic_vad` 以开启语义 VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在 VAD 开始事件发生时自动中断任何输出到默认
        会话（即。 `conversation` 的 `auto`）的进行中的响应。

### Realtime 转录会话音频输入语音检测

- `RealtimeTranscriptionSessionAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

  语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

  对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

    - `type: "server_vad"`

      轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

      如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      可选超时时间，超过该时间后会自动触发模型响应。这
      对于用户长时间停顿属于意外情况（如电话
      通话）时非常有用。模型将根据当前上下文提示用户继续对话
      。

      超时值将在最后一条模型响应的音频播放完毕后应用，
      即设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
      （与响应关联的）将在达到超时时间时发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
      会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

      如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
      毫秒为单位）。默认为 300 毫秒。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
      为 500 毫秒。值越短，模型响应越快，
      但可能会在用户短暂停顿时抢话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
      阈值越高，需要更响亮的音频才能激活模型，
      因此在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来确定用户何时说完话。

    - `type: "semantic_vad"`

      轮转检测的类型， `semantic_vad` 以开启语义 VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      是否在 VAD 开始事件发生时自动中断任何输出到默认
      会话（即。 `conversation` 的 `auto`）的进行中的响应。

### Realtime 转录会话创建请求

- `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

  实时转录会话对象配置。

  - `type: "transcription"`

    要创建的会话类型。始终 `transcription` 用于转录会话。

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

        输入音频降噪配置。可设置为 `null` 以关闭。
        降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
        过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转写文本前等待的时间。
          值越高可以提高转写准确度，但会增加延迟。
          仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在以下位置提供输入语言：
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          将提高准确度和降低延迟。

        - `languages: optional array of string`

          输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          可选的文本，用于指导模型的风格或延续先前的音频
          片段。
          对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
          提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

      - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

        语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

        语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

          - `type: "server_vad"`

            轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

            如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选超时时间，超过该时间后会自动触发模型响应。这
            对于用户长时间停顿属于意外情况（如电话
            通话）时非常有用。模型将根据当前上下文提示用户继续对话
            。

            超时值将在最后一条模型响应的音频播放完毕后应用，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            （与响应关联的）将在达到超时时间时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
            会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

            如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
            毫秒为单位）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
            为 500 毫秒。值越短，模型响应越快，
            但可能会在用户短暂停顿时抢话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
            阈值越高，需要更响亮的音频才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来确定用户何时说完话。

          - `type: "semantic_vad"`

            轮转检测的类型， `semantic_vad` 以开启语义 VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在 VAD 开始事件发生时自动中断任何输出到默认
            会话（即。 `conversation` 的 `auto`）的进行中的响应。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    服务器输出中包含的其他字段。

    `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime 翻译客户端事件

- `RealtimeTranslationClientEvent = RealtimeTranslationSessionUpdateEvent or RealtimeTranslationInputAudioBufferAppendEvent or RealtimeTranslationSessionCloseEvent`

  一个 Realtime 翻译客户端事件。

  - `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新翻译会话配置。翻译
    会话支持对 `audio.output.language`, `audio.input.transcription`,
    以及 `audio.input.noise_reduction`.

    - `session: RealtimeTranslationSessionUpdateRequest`

      要更新的翻译会话字段。会话 `type` 以及 `model` 在创建时
      设置，且无法通过 `session.update`.

      - `audio: optional object { input, output }`

        翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。设置为 `null` 以禁用它。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务器会发出
            `session.input_transcript.delta` 事件。翻译本身仍从
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

      可选的客户端生成的 ID，用于标识此事件。

  - `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到翻译会话输入音频缓冲区。

    WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
    小端原始音频字节。不支持的 WebSocket 音频格式会返回
    验证错误，因为低质量音频会显著降低翻译
    质量。

    翻译消耗 200 毫秒的引擎帧。为获得最佳实时行为，请追加
    音频以 200 毫秒的块为单位。如果块较短，服务器会将其缓冲，直到
    有足够的音频构成一帧。如果块较长，服务器会将其拆分为
    200 毫秒的帧并连续排队。

    在会话活动期间持续追加静音。如果客户端停止发送
    音频随后恢复，模型时间会将恢复的音频视为与
    先前的音频连续，而不是现实世界中的停顿。

    - `audio: string`

      Base64 编码的 24 kHz PCM16 单声道音频字节。

    - `type: "session.input_audio_buffer.append"`

      事件类型，必须为 `session.input_audio_buffer.append`.

      - `"session.input_audio_buffer.append"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `RealtimeTranslationSessionCloseEvent object { type, event_id }`

    优雅关闭实时翻译会话。服务器会刷新挂起的
    输入音频并在关闭前发出任何剩余的翻译输出
    会话。

    - `type: "session.close"`

      事件类型，必须为 `session.close`.

      - `"session.close"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

### 实时翻译客户端密钥创建请求

- `RealtimeTranslationClientSecretCreateRequest object { session, expires_after }`

  为实时API创建翻译会话和客户端密钥。

  - `session: RealtimeTranslationSessionCreateRequest`

    实时翻译会话配置。翻译会话持续流入源
    音频，并持续输出翻译后的音频及字幕增量。

    - `model: string`

      用于此会话的实时翻译模型。

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用它。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

  - `expires_after: optional object { anchor, seconds }`

    客户端密钥过期配置。过期指客户端密钥在
    创建会话后不再有效的时间点。会话开始后可能
    在该时间之后继续。一个密钥可用于创建多个会话，
    直到过期为止。

    - `anchor: optional "created_at"`

      客户端密钥过期的锚点，即 `seconds` 将添加到 `created_at` 客户端密钥的时间以产生过期时间戳。仅 `created_at` 当前已支持。

      - `"created_at"`

    - `seconds: optional number`

      从锚点到过期的秒数。选择一个介于 `10` 以及 `7200` (2小时)之间的值。如果未指定，默认值为600秒（10分钟）。

### Realtime 翻译客户端密钥创建响应

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    Realtime 翻译会话。翻译会话会持续将输入的
    音频翻译为配置的输出语言。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `model: string`

      用于此会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` 用于 Realtime 翻译会话。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### 实时翻译输入音频缓冲区追加事件

- `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到翻译会话输入音频缓冲区。

  WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
  小端原始音频字节。不支持的 WebSocket 音频格式会返回
  验证错误，因为低质量音频会显著降低翻译
  质量。

  翻译消耗 200 毫秒的引擎帧。为获得最佳实时行为，请追加
  音频以 200 毫秒的块为单位。如果块较短，服务器会将其缓冲，直到
  有足够的音频构成一帧。如果块较长，服务器会将其拆分为
  200 毫秒的帧并连续排队。

  在会话活动期间持续追加静音。如果客户端停止发送
  音频随后恢复，模型时间会将恢复的音频视为与
  先前的音频连续，而不是现实世界中的停顿。

  - `audio: string`

    Base64 编码的 24 kHz PCM16 单声道音频字节。

  - `type: "session.input_audio_buffer.append"`

    事件类型，必须为 `session.input_audio_buffer.append`.

    - `"session.input_audio_buffer.append"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 实时翻译输入转录增量事件

- `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当可选的源语言转录文本可用时返回。此事件
  仅在 `audio.input.transcription` 配置时发出。

  转录增量是仅追加的文本片段。客户端不应在
  增量之间无条件插入空格。

  - `delta: string`

    仅追加的源语言转录文本。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "session.input_transcript.delta"`

    事件类型，必须为 `session.input_transcript.delta`.

    - `"session.input_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，从翻译帧
    （当可用时）派生。它以 200 毫秒的增量前进，但多个转录
    增量可能共享相同的 `elapsed_ms`。将其视为对齐元数据，
    而非唯一的转录增量标识符。

### 实时翻译输出音频增量事件

- `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

  当翻译后的输出音频可用时返回。 `delta` 包含一个
  PCM16 音频块，其长度可能不同。客户端应解码并排队
  完整增量，而不是假设固定的字节或样本计数。

  - `delta: string`

    Base64 编码的翻译后音频数据。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "session.output_audio.delta"`

    事件类型，必须为 `session.output_audio.delta`.

    - `"session.output_audio.delta"`

  - `channels: optional number`

    音频通道数。

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，从翻译帧
    在可用时。将 `elapsed_ms` 视为对齐元数据，而不是唯一的
    事件标识符。

  - `format: optional "pcm16"`

    音频编码为 `delta`.

    - `"pcm16"`

  - `sample_rate: optional number`

    音频增量的采样率。

### 实时翻译输出转录增量事件

- `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当有可用的翻译后文本转录时返回。

  转录增量是仅追加的文本片段。客户端不应在
  增量之间无条件插入空格。

  - `delta: string`

    翻译输出音频的仅追加转录文本。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "session.output_transcript.delta"`

    事件类型，必须为 `session.output_transcript.delta`.

    - `"session.output_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，从翻译帧
    （当可用时）派生。它以 200 毫秒的增量前进，但多个转录
    增量可能共享相同的 `elapsed_ms`。将其视为对齐元数据，
    而非唯一的转录增量标识符。

### 实时翻译服务器事件

- `RealtimeTranslationServerEvent = RealtimeErrorEvent or RealtimeTranslationSessionCreatedEvent or RealtimeTranslationSessionUpdatedEvent or 4 more`

  一个实时翻译服务器事件。

  - `RealtimeErrorEvent object { error, event_id, type }`

    发生错误时返回，可能是客户端问题或服务器
    问题。大多数错误是可恢复的，会话将保持打开状态，我们
    建议实现方默认监控并记录错误消息。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        人类可读的错误消息。

      - `type: string`

        错误的类型（例如，"invalid_request_error"、"server_error"）。

      - `code: optional string or null`

        错误代码（如有）。

      - `event_id: optional string or null`

        导致错误的客户端事件的 event_id（如果适用）。

      - `param: optional string or null`

        与错误相关的参数（如有）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

    当翻译会话被创建时返回。当
    新连接建立时，作为第一个服务器事件自动发出。此事件包含
    默认的翻译会话配置。

    - `event_id: string`

      服务器事件的唯一 ID。

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

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务器会发出
            `session.input_transcript.delta` 事件。翻译本身仍从
            输入音频流运行。

            - `model: string`

              用于源转录增量的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转录增量的目标语言。

      - `expires_at: number`

        会话的过期时间戳，以自纪元以来的秒数表示。

      - `model: string`

        用于此会话的 Realtime 翻译模型。此字段在
        会话创建时设置，无法通过 `session.update`.

      - `type: "translation"`

        会话类型。始终为 `translation` 用于 Realtime 翻译会话。

        - `"translation"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

    当翻译会话更新时返回，除非 `session.update` 事件，
    出现错误。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `session: RealtimeTranslationSession`

      翻译会话配置。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `RealtimeTranslationSessionClosedEvent object { event_id, type }`

    当实时翻译会话关闭时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "session.closed"`

      事件类型，必须为 `session.closed`.

      - `"session.closed"`

  - `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当可选的源语言转录文本可用时返回。此事件
    仅在 `audio.input.transcription` 配置时发出。

    转录增量是仅追加的文本片段。客户端不应在
    增量之间无条件插入空格。

    - `delta: string`

      仅追加的源语言转录文本。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "session.input_transcript.delta"`

      事件类型，必须为 `session.input_transcript.delta`.

      - `"session.input_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，从翻译帧
      （当可用时）派生。它以 200 毫秒的增量前进，但多个转录
      增量可能共享相同的 `elapsed_ms`。将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当有可用的翻译后文本转录时返回。

    转录增量是仅追加的文本片段。客户端不应在
    增量之间无条件插入空格。

    - `delta: string`

      翻译输出音频的仅追加转录文本。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "session.output_transcript.delta"`

      事件类型，必须为 `session.output_transcript.delta`.

      - `"session.output_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，从翻译帧
      （当可用时）派生。它以 200 毫秒的增量前进，但多个转录
      增量可能共享相同的 `elapsed_ms`。将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

    当翻译后的输出音频可用时返回。 `delta` 包含一个
    PCM16 音频块，其长度可能不同。客户端应解码并排队
    完整增量，而不是假设固定的字节或样本计数。

    - `delta: string`

      Base64 编码的翻译后音频数据。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "session.output_audio.delta"`

      事件类型，必须为 `session.output_audio.delta`.

      - `"session.output_audio.delta"`

    - `channels: optional number`

      音频通道数。

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，从翻译帧
      在可用时。将 `elapsed_ms` 视为对齐元数据，而不是唯一的
      事件标识符。

    - `format: optional "pcm16"`

      音频编码为 `delta`.

      - `"pcm16"`

    - `sample_rate: optional number`

      音频增量的采样率。

### Realtime 翻译会话

- `RealtimeTranslationSession object { id, audio, expires_at, 2 more }`

  Realtime 翻译会话。翻译会话会持续将输入的
  音频翻译为配置的输出语言。

  - `id: string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务器会发出
        `session.input_transcript.delta` 事件。翻译本身仍从
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

  - `expires_at: number`

    会话的过期时间戳，以自纪元以来的秒数表示。

  - `model: string`

    用于此会话的 Realtime 翻译模型。此字段在
    会话创建时设置，无法通过 `session.update`.

  - `type: "translation"`

    会话类型。始终为 `translation` 用于 Realtime 翻译会话。

    - `"translation"`

### Realtime 翻译会话关闭事件

- `RealtimeTranslationSessionCloseEvent object { type, event_id }`

  优雅关闭实时翻译会话。服务器会刷新挂起的
  输入音频并在关闭前发出任何剩余的翻译输出
  会话。

  - `type: "session.close"`

    事件类型，必须为 `session.close`.

    - `"session.close"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### Realtime 翻译会话已关闭事件

- `RealtimeTranslationSessionClosedEvent object { event_id, type }`

  当实时翻译会话关闭时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "session.closed"`

    事件类型，必须为 `session.closed`.

    - `"session.closed"`

### Realtime 翻译会话创建请求

- `RealtimeTranslationSessionCreateRequest object { model, audio }`

  实时翻译会话配置。翻译会话持续流入源
  音频，并持续输出翻译后的音频及字幕增量。

  - `model: string`

    用于此会话的实时翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务器会发出
        `session.input_transcript.delta` 事件。翻译本身仍从
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

### Realtime 翻译会话已创建事件

- `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

  当翻译会话被创建时返回。当
  新连接建立时，作为第一个服务器事件自动发出。此事件包含
  默认的翻译会话配置。

  - `event_id: string`

    服务器事件的唯一 ID。

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

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `model: string`

      用于此会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` 用于 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### Realtime 翻译会话更新事件

- `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新翻译会话配置。翻译
  会话支持对 `audio.output.language`, `audio.input.transcription`,
  以及 `audio.input.noise_reduction`.

  - `session: RealtimeTranslationSessionUpdateRequest`

    要更新的翻译会话字段。会话 `type` 以及 `model` 在创建时
    设置，且无法通过 `session.update`.

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用它。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
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

    可选的客户端生成的 ID，用于标识此事件。

### Realtime 翻译会话更新请求

- `RealtimeTranslationSessionUpdateRequest object { audio }`

  可通过以下字段更新的实时翻译会话字段： `session.update`.

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务器会发出
        `session.input_transcript.delta` 事件。翻译本身仍从
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

### Realtime 翻译会话已更新事件

- `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

  当翻译会话更新时返回，除非 `session.update` 事件，
  出现错误。

  - `event_id: string`

    服务器事件的唯一 ID。

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

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `model: string`

      用于此会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` 用于 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Realtime 截断

- `RealtimeTruncation = "auto" or "disabled" or object { retention_ratio, type, token_limits }`

  当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

  客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

  截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

  可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

  - `"auto" or "disabled"`

    用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

    - `retention_ratio: number`

      当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

### 响应音频增量事件

- `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型生成的音频更新时返回。

  - `content_index: number`

    内容部分在项目内容数组中的索引。

  - `delta: string`

    Base64 编码的音频数据增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.delta"`

    事件类型，必须为 `response.output_audio.delta`.

    - `"response.output_audio.delta"`

### 响应音频完成事件

- `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

  当模型生成的音频完成时返回。当响应
  被中断、不完整或取消时也会触发。

  - `content_index: number`

    内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.done"`

    事件类型，必须为 `response.output_audio.done`.

    - `"response.output_audio.done"`

### 响应音频转录增量事件

- `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型生成的音频输出转录更新时返回。

  - `content_index: number`

    内容部分在项目内容数组中的索引。

  - `delta: string`

    转录增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio_transcript.delta"`

    事件类型，必须为 `response.output_audio_transcript.delta`.

    - `"response.output_audio_transcript.delta"`

### 响应音频转录完成事件

- `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

  当模型生成的音频输出转录流式传输完成时返回。当响应被中断、不完整或
  流式传输。当响应被中断、不完整或
  取消时也会触发。

  - `content_index: number`

    内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `transcript: string`

    音频的最终转录。

  - `type: "response.output_audio_transcript.done"`

    事件类型，必须为 `response.output_audio_transcript.done`.

    - `"response.output_audio_transcript.done"`

### 响应取消事件

- `ResponseCancelEvent object { type, event_id, response_id }`

  发送此事件以取消正在进行中的响应。服务器将
  以 `response.done` 状态为 `response.status=cancelled`。的
  事件作为回应。如果
  没有可取消的响应，服务器将返回错误。即使 `response.cancel` 没有正在进行的响应，调用
  也会返回错误，会话将不受影响。

  - `type: "response.cancel"`

    事件类型，必须为 `response.cancel`.

    - `"response.cancel"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

  - `response_id: optional string`

    要取消的特定响应 ID - 如果未提供，将取消
    默认对话中的进行中响应。

### 响应内容部分已添加事件

- `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

  当在响应生成期间向助理消息条目添加新的内容部分时返回
  。

  - `content_index: number`

    内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    添加内容部分的条目的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `part: object { audio, text, transcript, type }`

    添加的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果 type 为 "audio"）。

    - `text: optional string`

      文本内容（如果 type 为 "text"）。

    - `transcript: optional string`

      音频的转写文本（如果 type 为 "audio"）。

    - `type: optional "audio" or "text"`

      内容类型（"text"、"audio"）。

      - `"audio"`

      - `"text"`

  - `response_id: string`

    响应的 ID。

  - `type: "response.content_part.added"`

    事件类型，必须为 `response.content_part.added`.

    - `"response.content_part.added"`

### 响应内容部分完成事件

- `ResponseContentPartDoneEvent object { content_index, event_id, item_id, 4 more }`

  当助手消息项中的内容部分完成流式传输时返回。
  当响应被中断、不完整或取消时也会发出。

  - `content_index: number`

    内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `part: object { audio, text, transcript, type }`

    已完成的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果 type 为 "audio"）。

    - `text: optional string`

      文本内容（如果 type 为 "text"）。

    - `transcript: optional string`

      音频的转写文本（如果 type 为 "audio"）。

    - `type: optional "audio" or "text"`

      内容类型（"text"、"audio"）。

      - `"audio"`

      - `"text"`

  - `response_id: string`

    响应的 ID。

  - `type: "response.content_part.done"`

    事件类型，必须为 `response.content_part.done`.

    - `"response.content_part.done"`

### 响应创建事件

- `ResponseCreateEvent object { type, event_id, response }`

  此事件指示服务器创建 Response，即触发
  模型推理。在服务器 VAD 模式下，服务器将自动创建 Responses
  。

  一个 Response 将至少包含一个 Item，也可能包含两个，在这种情况下
  第二个将是函数调用。这些 Items 将默认追加到
  对话历史中。

  服务器将响应一个 `response.created` 事件、用于 Items 的
  和内容创建的事件，以及最终的 `response.done` 事件以指示
  响应已完成。

  该 `response.create` 事件包括推理配置，
  `instructions` 以及 `tools`。如果设置了这些，它们将覆盖会话的
  仅针对此响应的配置。

  响应可以超出默认会话的带外创建，这意味着它们可以
  有任意输入，并且可以禁用将输出写入会话。
  一次只能有一个响应写入默认会话，但除此之外，多个
  响应可以并行创建。 `metadata` 字段是消除歧义的好方法
  多个同时进行的响应。

  客户端可以设置 `conversation` 为 `none` 来创建不写入默认
  会话的响应。任意输入可以通过 `input` 字段提供，这是一个接受
  原始项目和现有项目引用的数组。

  - `type: "response.create"`

    事件类型，必须为 `response.create`.

    - `"response.create"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

  - `response: optional RealtimeResponseCreateParams`

    使用这些参数创建新的实时响应

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
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
          一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
          。
          我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

      控制响应添加到哪个会话。目前支持
      `auto` 以及 `none`，以及 `auto` 作为默认值。 `auto` 值
      表示响应的内容将添加到默认
      对话中。将此设置为 `none` 以创建带外响应，该响应
      不会将项添加到默认对话中。

      - `string`

      - `"auto" or "none"`

        控制响应添加到哪个会话。目前支持
        `auto` 以及 `none`，以及 `auto` 作为默认值。 `auto` 值
        表示响应的内容将添加到默认
        对话中。将此设置为 `none` 以创建带外响应，该响应
        不会将项添加到默认对话中。

        - `"auto"`

        - `"none"`

    - `input: optional array of ConversationItem`

      要包含在模型提示中的输入项。使用此字段
      会为此响应创建新的上下文，而不是使用默认
      对话。空数组 `[]` 将清除此响应的上下文。
      请注意，这可以包含对会话中先前出现的项的引用，
      使用其 id。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息，始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          所调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否已获批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          决策的可选原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 条目，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON 架构。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数的 JSON 字符串。

        - `name: string`

          所运行的工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          相关联的审批请求的 ID（如果有）。

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

        一个请求人工批准工具调用的 Realtime 项。

        - `id: string`

          该审批请求的唯一 ID。

        - `arguments: string`

          工具的 JSON 字符串参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发出请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `instructions: optional string`

      预置到模型调用之前的默认系统指令（即系统消息）。此字段允许客户端指导模型产生期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现友好”、“以下是良好响应的示例”），以及音频行为（例如“快速说话”、“在声音中注入情感”、“经常笑”）。不保证模型会遵循这些指令，但它们为模型提供了期望行为的指导。
      请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出令牌数，
      包括工具调用。提供一个介于 1 和 4096 之间的整数，以
      限制输出令牌，或 `inf` 用于获取给定模型的
      最大可用令牌。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象上的 16 个键值对集合。这可用于
      以结构化格式存储关于对象的附加信息，
      并通过 API 或仪表板查询对象。

      键是字符串，最大长度为 64 个字符。值是字符串，
      最大长度为 512 个字符。

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前唯一可能的值是
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      输出设置为模式 `text` 将禁用模型的音频输出。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅受
      推理 Realtime 模型（如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的值映射，用于替换你的
        提示中的变量。替换值可以是字符串，也可以是其他
        响应输入类型，如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          给模型的文本输入。

          - `text: string`

            给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `image_url: optional string or null`

            要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件的内容。

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `file_url: optional string`

            要发送给模型的文件的 URL。

          - `filename: optional string`

            要发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如）的推理投入
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。提供一种字符串模式，或强制指定某个
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个（如果有）工具。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或多个
        工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定函数。

        - `name: string`

          要调用的函数的名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
          调用它的指导，以及在调用时该告诉用户什么的指导
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          JSON Schema 中函数的参数。

        - `type: optional "function"`

          该工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol 让模型访问额外工具
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

          允许的工具名称列表或筛选对象。

          - `McpAllowedTools = array of string`

            允许的工具名称字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
          自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
          必须处理 OAuth 授权流程并提供此处的令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

          当前支持的 `connector_id` 值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google 日历： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook 日历： `connector_outlookcalendar`
          - Outlook 邮箱： `connector_outlookemail`
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

          此 MCP 工具是否延迟并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要批准。可以是
            `always`, `never`，或与需要批准的工具关联的筛选器对象
            。

            - `always: optional object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一批准策略。以下之一 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### 响应已创建事件

- `ResponseCreatedEvent object { event_id, response, type }`

  当创建新响应时返回。响应创建的第一个事件，
  此时响应处于初始状态 `in_progress`.

  - `event_id: string`

    服务器事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，格式类似于 `resp_1234`.

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

          模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
          便无法更改。当前
          可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
            便无法更改。当前
            可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

      响应被添加到的会话，由事件中的 `conversation`
      字段决定。如果 `response.create` ，则响应不会 `auto`，被添加到任何会话，且
      的值将为 `conversation_id` 。如果响应是由 VAD
      `conv_1234`。的 `none`，自动触发的，则响应将被添加到默认会话，且
      的值将为 `conversation_id` 将为 `null`。如果响应正在被
      自动触发，则响应将被添加到默认会话

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出令牌数，
      （包括工具调用），用于此响应。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象上的 16 个键值对集合。这可用于
      以结构化格式存储关于对象的附加信息，
      并通过 API 或仪表板查询对象。

      键是字符串，最大长度为 64 个字符。值是字符串，
      最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息，始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          所调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否已获批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          决策的可选原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 条目，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON 架构。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数的 JSON 字符串。

        - `name: string`

          所运行的工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          相关联的审批请求的 ID（如果有）。

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

        一个请求人工批准工具调用的 Realtime 项。

        - `id: string`

          该审批请求的唯一 ID。

        - `arguments: string`

          工具的 JSON 字符串参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发出请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前唯一可能的值是
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      输出设置为模式 `text` 将禁用模型的音频输出。

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
        当 `status` 为 `failed`.

        - `code: optional string`

          错误代码（如有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        响应未完成的原因。对于 `cancelled` 响应，为以下之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，为以下之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器激活并截断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        与 `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      响应的使用统计，这将对应计费。一个
      Realtime API 会话将维护对话上下文并追加新的
      项目到对话中，因此前几轮的输出（文本和
      音频令牌）将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        关于响应中使用的输入令牌的详细信息。缓存令牌是对话中前几轮的令牌，作为当前响应的上下文包含在内。这里的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和非缓存令牌。

        - `audio_tokens: optional number`

          作为 Response 输入使用的音频 token 数量。

        - `cached_tokens: optional number`

          作为 Response 输入使用的缓存 token 数量。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          作为 Response 输入使用的缓存 token 的详细信息。

          - `audio_tokens: optional number`

            作为 Response 输入使用的缓存音频 token 数量。

          - `image_tokens: optional number`

            作为 Response 输入使用的缓存图像 token 数量。

          - `text_tokens: optional number`

            作为 Response 输入使用的缓存文本 token 数量。

        - `image_tokens: optional number`

          作为 Response 输入使用的图像 token 数量。

        - `text_tokens: optional number`

          作为 Response 输入使用的文本 token 数量。

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

        Response 中的 token 总数，包括输入和输出
        文本和音频 token。

  - `type: "response.created"`

    事件类型，必须为 `response.created`.

    - `"response.created"`

### 响应完成事件

- `ResponseDoneEvent object { event_id, response, type }`

  当响应完成流式传输时返回。无论最终状态如何，始终会发出。
  事件中包含的 Response 对象将 `response.done` 包含
  响应中的所有输出项，但会省略原始音频数据。

  客户端应检查响应的 `status` 字段以确定是否成功
  (`completed`）或是否有其他结果： `cancelled`, `failed`，或 `incomplete`.

  响应将包含响应期间生成的所有输出项，不包括
  任何音频内容。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，格式类似于 `resp_1234`.

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

          模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
          便无法更改。当前
          可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
            便无法更改。当前
            可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

      响应被添加到的会话，由事件中的 `conversation`
      字段决定。如果 `response.create` ，则响应不会 `auto`，被添加到任何会话，且
      的值将为 `conversation_id` 。如果响应是由 VAD
      `conv_1234`。的 `none`，自动触发的，则响应将被添加到默认会话，且
      的值将为 `conversation_id` 将为 `null`。如果响应正在被
      自动触发，则响应将被添加到默认会话

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出令牌数，
      （包括工具调用），用于此响应。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象上的 16 个键值对集合。这可用于
      以结构化格式存储关于对象的附加信息，
      并通过 API 或仪表板查询对象。

      键是字符串，最大长度为 64 个字符。值是字符串，
      最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息，始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

            音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          所调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

        - `object: optional "realtime.item"`

          正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否已获批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          决策的可选原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 条目，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON 架构。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数的 JSON 字符串。

        - `name: string`

          所运行的工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          相关联的审批请求的 ID（如果有）。

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

        一个请求人工批准工具调用的 Realtime 项。

        - `id: string`

          该审批请求的唯一 ID。

        - `arguments: string`

          工具的 JSON 字符串参数。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发出请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前唯一可能的值是
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      输出设置为模式 `text` 将禁用模型的音频输出。

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
        当 `status` 为 `failed`.

        - `code: optional string`

          错误代码（如有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        响应未完成的原因。对于 `cancelled` 响应，为以下之一： `turn_detected` （服务器 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，为以下之一： `max_output_tokens` 或 `content_filter`  （服务端安全过滤器激活并截断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        与 `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      响应的使用统计，这将对应计费。一个
      Realtime API 会话将维护对话上下文并追加新的
      项目到对话中，因此前几轮的输出（文本和
      音频令牌）将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        关于响应中使用的输入令牌的详细信息。缓存令牌是对话中前几轮的令牌，作为当前响应的上下文包含在内。这里的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和非缓存令牌。

        - `audio_tokens: optional number`

          作为 Response 输入使用的音频 token 数量。

        - `cached_tokens: optional number`

          作为 Response 输入使用的缓存 token 数量。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          作为 Response 输入使用的缓存 token 的详细信息。

          - `audio_tokens: optional number`

            作为 Response 输入使用的缓存音频 token 数量。

          - `image_tokens: optional number`

            作为 Response 输入使用的缓存图像 token 数量。

          - `text_tokens: optional number`

            作为 Response 输入使用的缓存文本 token 数量。

        - `image_tokens: optional number`

          作为 Response 输入使用的图像 token 数量。

        - `text_tokens: optional number`

          作为 Response 输入使用的文本 token 数量。

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

        Response 中的 token 总数，包括输入和输出
        文本和音频 token。

  - `type: "response.done"`

    事件类型，必须为 `response.done`.

    - `"response.done"`

### 响应函数调用参数增量事件

- `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

  当模型生成的函数调用参数更新时返回。

  - `call_id: string`

    函数调用的 ID。

  - `delta: string`

    以 JSON 字符串形式表示的参数增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.function_call_arguments.delta"`

    事件类型，必须为 `response.function_call_arguments.delta`.

    - `"response.function_call_arguments.delta"`

### 响应函数调用参数完成事件

- `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

  当模型生成的函数调用参数完成流式传输时返回。
  当响应被中断、不完整或取消时也会发出。

  - `arguments: string`

    最终参数，以 JSON 字符串形式表示。

  - `call_id: string`

    函数调用的 ID。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `name: string`

    所调用函数的名称。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.function_call_arguments.done"`

    事件类型，必须为 `response.function_call_arguments.done`.

    - `"response.function_call_arguments.done"`

### 响应 MCP 调用参数增量

- `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

  当响应生成期间 MCP 工具调用参数更新时返回。

  - `delta: string`

    JSON 编码的参数增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.mcp_call_arguments.delta"`

    事件类型，必须为 `response.mcp_call_arguments.delta`.

    - `"response.mcp_call_arguments.delta"`

  - `obfuscation: optional string or null`

    如果存在，表示增量文本已被混淆。

### 响应 MCP 调用参数完成

- `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

  在响应生成过程中完成 MCP 工具调用参数时返回。

  - `arguments: string`

    最终 JSON 编码的参数字符串。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.mcp_call_arguments.done"`

    事件类型，必须为 `response.mcp_call_arguments.done`.

    - `"response.mcp_call_arguments.done"`

### 响应 MCP 调用已完成

- `ResponseMcpCallCompleted object { event_id, item_id, output_index, type }`

  当 MCP 工具调用成功完成时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `type: "response.mcp_call.completed"`

    事件类型，必须为 `response.mcp_call.completed`.

    - `"response.mcp_call.completed"`

### 响应 MCP 调用失败

- `ResponseMcpCallFailed object { event_id, item_id, output_index, type }`

  当 MCP 工具调用失败时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `type: "response.mcp_call.failed"`

    事件类型，必须为 `response.mcp_call.failed`.

    - `"response.mcp_call.failed"`

### 响应 MCP 调用进行中

- `ResponseMcpCallInProgress object { event_id, item_id, output_index, type }`

  当 MCP 工具调用已开始且正在进行时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `type: "response.mcp_call.in_progress"`

    事件类型，必须为 `response.mcp_call.in_progress`.

    - `"response.mcp_call.in_progress"`

### 响应输出项已添加事件

- `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

  当 Response 生成期间创建新 Item 时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        所调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 架构。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        相关联的审批请求的 ID（如果有）。

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

      一个请求人工批准工具调用的 Realtime 项。

      - `id: string`

        该审批请求的唯一 ID。

      - `arguments: string`

        工具的 JSON 字符串参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

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

### 响应输出项完成事件

- `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

  当 Item 完成流式传输时返回。当 Response 被
  中断、不完整或取消时也会发出。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话中的任何时点添加。对于对话行为上的重大变更，请使用指令；但对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节（对于 `input_audio`），这些将按照会话中输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          音频转录文本（用于 `input_audio`）。此内容不会发送给模型，但会附加到消息项以供参考。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，这些字节将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认为 PCM 16 位 24kHz 单声道。

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

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        所调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，或者仅为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        正在返回的 API 对象的标识符 - 始终为 `realtime.item`。创建新条目时可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 架构。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        相关联的审批请求的 ID（如果有）。

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

      一个请求人工批准工具调用的 Realtime 项。

      - `id: string`

        该审批请求的唯一 ID。

      - `arguments: string`

        工具的 JSON 字符串参数。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

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

### 响应文本增量事件

- `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

  当 "output_text" 内容部分的文本值更新时返回。

  - `content_index: number`

    内容部分在项目内容数组中的索引。

  - `delta: string`

    文本增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_text.delta"`

    事件类型，必须为 `response.output_text.delta`.

    - `"response.output_text.delta"`

### 响应文本完成事件

- `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

  当 "output_text" 内容部分的文本值完成流式传输时返回。当
  Response 被中断、不完整或取消时也会发出。

  - `content_index: number`

    内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    输出条目在响应中的索引。

  - `response_id: string`

    响应的 ID。

  - `text: string`

    最终文本内容。

  - `type: "response.output_text.done"`

    事件类型，必须为 `response.output_text.done`.

    - `"response.output_text.done"`

### 会话创建事件

- `SessionCreatedEvent object { event_id, session, type }`

  当创建 Session 时返回。当建立新的
  连接作为第一个服务器事件时自动发出。此事件将包含
  默认的 Session 配置。

  - `event_id: string`

    服务器事件的唯一 ID。

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

        要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

            输入音频降噪配置。可设置为 `null` 以关闭。
            降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
            过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

            语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

            语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

              - `type: "server_vad"`

                轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超过该时间后会自动触发模型响应。这
                对于用户长时间停顿属于意外情况（如电话
                通话）时非常有用。模型将根据当前上下文提示用户继续对话
                。

                超时值将在最后一条模型响应的音频播放完毕后应用，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                （与响应关联的）将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
                会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
                毫秒为单位）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500 毫秒。值越短，模型响应越快，
                但可能会在用户短暂停顿时抢话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                阈值越高，需要更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时说完话。

              - `type: "semantic_vad"`

                轮转检测的类型， `semantic_vad` 以开启语义 VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在 VAD 开始事件发生时自动中断任何输出到默认
                会话（即。 `conversation` 的 `auto`）的进行中的响应。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型口语响应速度相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

            此参数是音频生成后的后处理调整，它
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
            便无法更改。当前
            可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
              便无法更改。当前
              可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

        会话的过期时间戳，以自纪元以来的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务器输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

        请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出令牌数，
        包括工具调用。提供一个介于 1 和 4096 之间的整数，以
        限制输出令牌，或 `inf` 用于获取给定模型的
        最大可用令牌。默认为 `inf`.

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
        模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
        模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的值映射，用于替换你的
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            给模型的文本输入。

            - `text: string`

              给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `image_url: optional string or null`

              要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件的内容。

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `file_url: optional string`

              要发送给模型的文件的 URL。

            - `filename: optional string`

              要发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如）的推理投入
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供一种字符串模式，或强制指定某个
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个（如果有）工具。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个
          工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定函数。

          - `name: string`

            要调用的函数的名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
            调用它的指导，以及在调用时该告诉用户什么的指导
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            JSON Schema 中函数的参数。

          - `type: optional "function"`

            该工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol 让模型访问额外工具
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

            允许的工具名称列表或筛选对象。

            - `McpAllowedTools = array of string`

              允许的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
            自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
            必须处理 OAuth 授权流程并提供此处的令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 邮箱： `connector_outlookemail`
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

            此 MCP 工具是否延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要批准。可以是
              `always`, `never`，或与需要批准的工具关联的筛选器对象
              。

              - `always: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一批准策略。以下之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
        为会话启用了 追踪，配置便无法修改。

        `auto` 将为会话创建带有默认值的 追踪，用于
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并为追踪配置选项设置默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的精细配置。

          - `group_id: optional string`

            要附加到此追踪的组 ID，以启用过滤和
            在追踪仪表板中进行分组。

          - `metadata: optional unknown`

            要附加到此追踪的任意元数据，以启用
            在追踪仪表板中进行过滤。

          - `workflow_name: optional string`

            要附加到此追踪的工作流名称。此名称用于
            在追踪仪表板中命名此追踪。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

        客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

        截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

        可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

        - `"auto" or "disabled"`

          用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

          - `retention_ratio: number`

            当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

            - `post_instructions: optional number`

              指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

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

        会话输入音频的配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
            VAD 表示模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时响应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（以毫秒为单位）。默认为
              为 500 毫秒。值越短，模型响应越快，
              但可能会在用户短暂停顿时抢话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
              阈值越高，需要更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅限 `server_vad` 当前已支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元以来的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务器输出中包含的其他字段。

        - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### 会话更新事件

- `SessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新会话的配置。
  客户端可随时发送此事件以更新任何字段
  除 `voice` 以及 `model`. `voice` 仅在没有其他音频输出时才能更新。

  当服务器收到 `session.update`，时，它将响应
  以 `session.updated` 事件，显示完整且有效的配置。
  只有存在于 `session.update` 中的字段才会被更新。要清除类似
  `instructions`，的字段，请传入空字符串。要清除类似 `tools`，的字段，请传入空数组。
  要清除类似 `turn_detection`，的字段，请传入 `null`.

  - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

    更新 Realtime 会话。选择实时
    会话或转录会话。

    - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

      Realtime 会话对象配置。

      - `type: "realtime"`

        要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

            输入音频降噪配置。可设置为 `null` 以关闭。
            降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
            过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional AudioTranscription`

            输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

            - `delay: optional "minimal" or "low" or "medium" or 2 more`

              控制模型在输出转写文本前等待的时间。
              值越高可以提高转写准确度，但会增加延迟。
              仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

            - `keywords: optional array of string`

              用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

            - `language: optional string`

              输入音频的语言。在以下位置提供输入语言：
              [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
              将提高准确度和降低延迟。

            - `languages: optional array of string`

              输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              可选的文本，用于指导模型的风格或延续先前的音频
              片段。
              对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
              对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
              提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

          - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

            语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

            语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

              - `type: "server_vad"`

                轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超过该时间后会自动触发模型响应。这
                对于用户长时间停顿属于意外情况（如电话
                通话）时非常有用。模型将根据当前上下文提示用户继续对话
                。

                超时值将在最后一条模型响应的音频播放完毕后应用，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                （与响应关联的）将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
                会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
                毫秒为单位）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500 毫秒。值越短，模型响应越快，
                但可能会在用户短暂停顿时抢话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                阈值越高，需要更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时说完话。

              - `type: "semantic_vad"`

                轮转检测的类型， `semantic_vad` 以开启语义 VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在 VAD 开始事件发生时自动中断任何输出到默认
                会话（即。 `conversation` 的 `auto`）的进行中的响应。

        - `output: optional RealtimeAudioConfigOutput`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型口语响应速度相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

            此参数是音频生成后的后处理调整，它
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

            模型用于响应的声音。支持的内置声音有
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
            一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
            。
            我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

        服务器输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

        请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出令牌数，
        包括工具调用。提供一个介于 1 和 4096 之间的整数，以
        限制输出令牌，或 `inf` 用于获取给定模型的
        最大可用令牌。默认为 `inf`.

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
        模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
        模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以并行调用多个工具。仅受
        推理 Realtime 模型（如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的值映射，用于替换你的
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            给模型的文本输入。

            - `text: string`

              给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `image_url: optional string or null`

              要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件的内容。

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `file_url: optional string`

              要发送给模型的文件的 URL。

            - `filename: optional string`

              要发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如）的推理投入
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional RealtimeToolChoiceConfig`

        模型如何选择工具。提供一种字符串模式，或强制指定某个
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个（如果有）工具。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个
          工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定函数。

          - `name: string`

            要调用的函数的名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
            调用它的指导，以及在调用时该告诉用户什么的指导
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            JSON Schema 中函数的参数。

          - `type: optional "function"`

            该工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol 让模型访问额外工具
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

            允许的工具名称列表或筛选对象。

            - `McpAllowedTools = array of string`

              允许的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
            自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
            必须处理 OAuth 授权流程并提供此处的令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 邮箱： `connector_outlookemail`
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

            此 MCP 工具是否延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要批准。可以是
              `always`, `never`，或与需要批准的工具关联的筛选器对象
              。

              - `always: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一批准策略。以下之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional RealtimeTracingConfig or null`

        Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
        为会话启用了 追踪，配置便无法修改。

        `auto` 将为会话创建带有默认值的 追踪，用于
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并为追踪配置选项设置默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的精细配置。

          - `group_id: optional string`

            要附加到此追踪的组 ID，以启用过滤和
            在追踪仪表板中进行分组。

          - `metadata: optional unknown`

            要附加到此追踪的任意元数据，以启用
            在追踪仪表板中进行过滤。

          - `workflow_name: optional string`

            要附加到此追踪的工作流名称。此名称用于
            在追踪仪表板中命名此追踪。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

        客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

        截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

        可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

        - `"auto" or "disabled"`

          用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

          - `retention_ratio: number`

            当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

            - `post_instructions: optional number`

              指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

    - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

      实时转录会话对象配置。

      - `type: "transcription"`

        要创建的会话类型。始终 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional RealtimeTranscriptionSessionAudio`

        输入和输出音频的配置。

        - `input: optional RealtimeTranscriptionSessionAudioInput`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪配置。可设置为 `null` 以关闭。
            降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
            过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `transcription: optional AudioTranscription`

            输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

          - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

            语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

            语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

              - `type: "server_vad"`

                轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超过该时间后会自动触发模型响应。这
                对于用户长时间停顿属于意外情况（如电话
                通话）时非常有用。模型将根据当前上下文提示用户继续对话
                。

                超时值将在最后一条模型响应的音频播放完毕后应用，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                （与响应关联的）将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
                会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
                毫秒为单位）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500 毫秒。值越短，模型响应越快，
                但可能会在用户短暂停顿时抢话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                阈值越高，需要更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时说完话。

              - `type: "semantic_vad"`

                轮转检测的类型， `semantic_vad` 以开启语义 VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在 VAD 开始事件发生时自动中断任何输出到默认
                会话（即。 `conversation` 的 `auto`）的进行中的响应。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务器输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。这是客户端可以分配的任意字符串。如果事件出错，它将传回，但相应的 `session.updated` 事件不会包含它。

### 会话已更新事件

- `SessionUpdatedEvent object { event_id, session, type }`

  当会话以 `session.update` 事件更新时返回，除非
  发生错误。

  - `event_id: string`

    服务器事件的唯一 ID。

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

        要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

            输入音频降噪配置。可设置为 `null` 以关闭。
            降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
            过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

            语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

            语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

              - `type: "server_vad"`

                轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超过该时间后会自动触发模型响应。这
                对于用户长时间停顿属于意外情况（如电话
                通话）时非常有用。模型将根据当前上下文提示用户继续对话
                。

                超时值将在最后一条模型响应的音频播放完毕后应用，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                （与响应关联的）将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
                会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
                毫秒为单位）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500 毫秒。值越短，模型响应越快，
                但可能会在用户短暂停顿时抢话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                阈值越高，需要更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时说完话。

              - `type: "semantic_vad"`

                轮转检测的类型， `semantic_vad` 以开启语义 VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在 VAD 开始事件发生时自动中断任何输出到默认
                会话（即。 `conversation` 的 `auto`）的进行中的响应。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型口语响应速度相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

            此参数是音频生成后的后处理调整，它
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
            便无法更改。当前
            可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
              便无法更改。当前
              可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

        会话的过期时间戳，以自纪元以来的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务器输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

        请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出令牌数，
        包括工具调用。提供一个介于 1 和 4096 之间的整数，以
        限制输出令牌，或 `inf` 用于获取给定模型的
        最大可用令牌。默认为 `inf`.

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
        模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
        模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的值映射，用于替换你的
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            给模型的文本输入。

            - `text: string`

              给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `image_url: optional string or null`

              要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件的内容。

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `file_url: optional string`

              要发送给模型的文件的 URL。

            - `filename: optional string`

              要发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如）的推理投入
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供一种字符串模式，或强制指定某个
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个（如果有）工具。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个
          工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定函数。

          - `name: string`

            要调用的函数的名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
            调用它的指导，以及在调用时该告诉用户什么的指导
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            JSON Schema 中函数的参数。

          - `type: optional "function"`

            该工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol 让模型访问额外工具
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

            允许的工具名称列表或筛选对象。

            - `McpAllowedTools = array of string`

              允许的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
            自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
            必须处理 OAuth 授权流程并提供此处的令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 邮箱： `connector_outlookemail`
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

            此 MCP 工具是否延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要批准。可以是
              `always`, `never`，或与需要批准的工具关联的筛选器对象
              。

              - `always: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一批准策略。以下之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
        为会话启用了 追踪，配置便无法修改。

        `auto` 将为会话创建带有默认值的 追踪，用于
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并为追踪配置选项设置默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的精细配置。

          - `group_id: optional string`

            要附加到此追踪的组 ID，以启用过滤和
            在追踪仪表板中进行分组。

          - `metadata: optional unknown`

            要附加到此追踪的任意元数据，以启用
            在追踪仪表板中进行过滤。

          - `workflow_name: optional string`

            要附加到此追踪的工作流名称。此名称用于
            在追踪仪表板中命名此追踪。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

        客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

        截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

        可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

        - `"auto" or "disabled"`

          用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

          - `retention_ratio: number`

            当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

            - `post_instructions: optional number`

              指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

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

        会话输入音频的配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
            VAD 表示模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时响应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（以毫秒为单位）。默认为
              为 500 毫秒。值越短，模型响应越快，
              但可能会在用户短暂停顿时抢话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
              阈值越高，需要更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅限 `server_vad` 当前已支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元以来的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务器输出中包含的其他字段。

        - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

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

      转录中包含的项目集。当前可用的项目有：
      `item.input_audio_transcription.logprobs`

      - `"item.input_audio_transcription.logprobs"`

    - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

      输入音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
      对于 `pcm16`，输入音频必须是 24kHz 采样率、16 位 PCM、
      单声道（mono）且为小端字节序。

      - `"pcm16"`

      - `"g711_ulaw"`

      - `"g711_alaw"`

    - `input_audio_noise_reduction: optional object { type }`

      输入音频降噪配置。可设置为 `null` 以关闭。
      降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
      过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `input_audio_transcription: optional AudioTranscription`

      输入音频转录的配置。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本前等待的时间。
        值越高可以提高转写准确度，但会增加延迟。
        仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在以下位置提供输入语言：
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        将提高准确度和降低延迟。

      - `languages: optional array of string`

        输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于指导模型的风格或延续先前的音频
        片段。
        对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
        提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。可设置为 `null` 关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到语音之前包含的音频量（以
        毫秒为单位）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        检测语音停止的静音持续时间（以毫秒为单位）。默认为
        为 500 毫秒。值越短，模型响应越快，
        但可能会在用户短暂停顿时抢话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
        阈值越高，需要更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

      - `type: optional "server_vad"`

        轮次检测的类型。仅 `server_vad` 目前支持转录会话。

        - `"server_vad"`

  - `type: "transcription_session.update"`

    事件类型，必须为 `transcription_session.update`.

    - `"transcription_session.update"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 转录会话已更新事件

- `TranscriptionSessionUpdatedEvent object { event_id, session, type }`

  当转录会话通过以下方式更新时返回 `transcription_session.update` 事件更新时返回，除非
  发生错误。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `session: object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

    一个新的 Realtime 转录会话配置。

    当会话通过 REST API 在服务端创建时，会话对象
    还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。此
    属性在会话通过 WebSocket API 更新时不出现。

    - `client_secret: object { expires_at, value }`

      API 返回的临时密钥。仅当会话
      通过 REST API 在服务端创建时出现。

      - `expires_at: number`

        令牌过期的时间戳。目前，所有令牌在
        一分钟后过期。

      - `value: string`

        可在客户端环境中使用的临时密钥，用于认证与
        实时 API 的连接。请在客户端环境中使用此密钥，而不是
        标准的 API 令牌，后者应仅在 服务端使用。

    - `input_audio_format: optional string`

      输入音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

    - `input_audio_transcription: optional object { language, languages, model, prompt }`

      转录模型的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

      模型可以响应的模态集合。要禁用音频，
      设置为 ["text"]。

      - `"text"`

      - `"audio"`

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。可设置为 `null` 以关闭。服务端
      VAD 表示模型将根据
      音频音量，并在用户语音结束时响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到语音之前包含的音频量（以
        毫秒为单位）。默认为 300 毫秒。

      - `silence_duration_ms: optional number`

        检测语音停止的静音持续时间（以毫秒为单位）。默认为
        为 500 毫秒。值越短，模型响应越快，
        但可能会在用户短暂停顿时抢话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
        阈值越高，需要更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

      - `type: optional string`

        轮次检测的类型，仅限 `server_vad` 当前已支持。

  - `type: "transcription_session.updated"`

    事件类型，必须为 `transcription_session.updated`.

    - `"transcription_session.updated"`

# 调用

## 接受通话

**post** `/realtime/calls/{call_id}/accept`

接受一个来电 SIP 呼叫，并配置将处理该呼叫的实时会话
。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

      输入音频降噪配置。可设置为 `null` 以关闭。
      降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
      过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本前等待的时间。
        值越高可以提高转写准确度，但会增加延迟。
        仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在以下位置提供输入语言：
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        将提高准确度和降低延迟。

      - `languages: optional array of string`

        输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于指导模型的风格或延续先前的音频
        片段。
        对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
        提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

      语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

        - `type: "server_vad"`

          轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

          如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选超时时间，超过该时间后会自动触发模型响应。这
          对于用户长时间停顿属于意外情况（如电话
          通话）时非常有用。模型将根据当前上下文提示用户继续对话
          。

          超时值将在最后一条模型响应的音频播放完毕后应用，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          （与响应关联的）将在达到超时时间时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
          会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

          如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
          毫秒为单位）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
          为 500 毫秒。值越短，模型响应越快，
          但可能会在用户短暂停顿时抢话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
          阈值越高，需要更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来确定用户何时说完话。

        - `type: "semantic_vad"`

          轮转检测的类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在 VAD 开始事件发生时自动中断任何输出到默认
          会话（即。 `conversation` 的 `auto`）的进行中的响应。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型口语响应速度相对于原始速度的倍数。
      1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

      此参数是音频生成后的后处理调整，它
      也可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于响应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
      。
      我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

  服务器输出中包含的其他字段。

  `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

  请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

- `max_output_tokens: optional number or "inf"`

  单个助手响应的最大输出令牌数，
  包括工具调用。提供一个介于 1 和 4096 之间的整数，以
  限制输出令牌，或 `inf` 用于获取给定模型的
  最大可用令牌。默认为 `inf`.

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
  模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
  模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以并行调用多个工具。仅受
  推理 Realtime 模型（如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的值映射，用于替换你的
    提示中的变量。替换值可以是字符串，也可以是其他
    响应输入类型，如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      给模型的文本输入。

      - `text: string`

        给模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型。始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        要发送给模型的文件的 ID。

      - `image_url: optional string or null`

        要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        要发送给模型的文件的内容。

      - `file_id: optional string or null`

        要发送给模型的文件的 ID。

      - `file_url: optional string`

        要发送给模型的文件的 URL。

      - `filename: optional string`

        要发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制支持推理的 Realtime 模型（例如）的推理投入
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型如何选择工具。提供一种字符串模式，或强制指定某个
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个（如果有）工具。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或多个
    工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项强制模型调用特定函数。

    - `name: string`

      要调用的函数的名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
      调用它的指导，以及在调用时该告诉用户什么的指导
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      JSON Schema 中函数的参数。

    - `type: optional "function"`

      该工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol 让模型访问额外工具
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

      允许的工具名称列表或筛选对象。

      - `McpAllowedTools = array of string`

        允许的工具名称字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        指定允许哪些工具的筛选对象。

        - `read_only: optional boolean`

          指示工具是否修改数据或为只读。如果
          MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此筛选条件。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
      自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
      必须处理 OAuth 授权流程并提供此处的令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
      关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

      当前支持的 `connector_id` 值包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google 日历： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook 日历： `connector_outlookcalendar`
      - Outlook 邮箱： `connector_outlookemail`
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

      此 MCP 工具是否延迟并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要批准。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要批准。可以是
        `always`, `never`，或与需要批准的工具关联的筛选器对象
        。

        - `always: optional object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一批准策略。以下之一 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
  为会话启用了 追踪，配置便无法修改。

  `auto` 将为会话创建带有默认值的 追踪，用于
  工作流名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并为追踪配置选项设置默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的精细配置。

    - `group_id: optional string`

      要附加到此追踪的组 ID，以启用过滤和
      在追踪仪表板中进行分组。

    - `metadata: optional unknown`

      要附加到此追踪的任意元数据，以启用
      在追踪仪表板中进行过滤。

    - `workflow_name: optional string`

      要附加到此追踪的工作流名称。此名称用于
      在追踪仪表板中命名此追踪。

- `truncation: optional RealtimeTruncation`

  当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

  客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

  截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

  可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

  - `"auto" or "disabled"`

    用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

    - `retention_ratio: number`

      当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

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

## 挂断电话

**post** `/realtime/calls/{call_id}/hangup`

结束活动的 Realtime API 调用，无论其是通过 SIP 还是
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

## 参考调用

**post** `/realtime/calls/{call_id}/refer`

使用 SIP REFER 动词将活动中的 SIP 呼叫转移到新目的地。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应出现在 SIP Refer-To 头部中的 URI。支持如下值
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

通过向呼叫方返回 SIP 状态码来拒绝传入的 SIP 呼叫。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  返回给呼叫方的 SIP 响应代码。默认为 `603` （拒绝）
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

创建一个带有相关会话配置的 Realtime 客户端密钥。

客户端密钥是短期令牌，可以传递给客户端应用，
例如 Web 前端或移动客户端，从而授予对 Realtime API 的访问权限，而不会
泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义 TTL。

你还可以将会话配置选项附加到客户端密钥，这些选项将
应用于使用该客户端密钥创建的任何会话，但这些选项也可以被
客户端连接覆盖。

[了解更多关于通过 WebRTC 使用客户端密钥进行身份验证的信息](/docs/guides/realtime-webrtc).

返回创建的客户端密钥和有效的会话对象。客户端密钥是一个字符串，看起来像 `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期指客户端密钥在
  创建会话后不再有效的时间点。会话开始后可能
  在该时间之后继续。一个密钥可用于创建多个会话，
  直到过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，即 `seconds` 将添加到 `created_at` 客户端密钥的时间以产生过期时间戳。仅 `created_at` 当前已支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择一个介于 `10` 以及 `7200` (2小时)之间的值。如果未指定，默认值为600秒（10分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择实时
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
          过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转写文本前等待的时间。
            值越高可以提高转写准确度，但会增加延迟。
            仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在以下位置提供输入语言：
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            将提高准确度和降低延迟。

          - `languages: optional array of string`

            输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            可选的文本，用于指导模型的风格或延续先前的音频
            片段。
            对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
            提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

          语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

            - `type: "server_vad"`

              轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

              如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，超过该时间后会自动触发模型响应。这
              对于用户长时间停顿属于意外情况（如电话
              通话）时非常有用。模型将根据当前上下文提示用户继续对话
              。

              超时值将在最后一条模型响应的音频播放完毕后应用，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              （与响应关联的）将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
              会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

              如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
              为 500 毫秒。值越短，模型响应越快，
              但可能会在用户短暂停顿时抢话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
              阈值越高，需要更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来确定用户何时说完话。

            - `type: "semantic_vad"`

              轮转检测的类型， `semantic_vad` 以开启语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断任何输出到默认
              会话（即。 `conversation` 的 `auto`）的进行中的响应。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型口语响应速度相对于原始速度的倍数。
          1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

          此参数是音频生成后的后处理调整，它
          也可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于响应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
          一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，会话期间就不能更改声音
          。
          我们建议使用 `marin` 以及 `cedar` 以获得最佳质量。

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

      服务器输出中包含的其他字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

      请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出令牌数，
      包括工具调用。提供一个介于 1 和 4096 之间的整数，以
      限制输出令牌，或 `inf` 用于获取给定模型的
      最大可用令牌。默认为 `inf`.

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
      模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
      模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅受
      推理 Realtime 模型（如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的值映射，用于替换你的
        提示中的变量。替换值可以是字符串，也可以是其他
        响应输入类型，如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          给模型的文本输入。

          - `text: string`

            给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `image_url: optional string or null`

            要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件的内容。

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `file_url: optional string`

            要发送给模型的文件的 URL。

          - `filename: optional string`

            要发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如）的推理投入
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型如何选择工具。提供一种字符串模式，或强制指定某个
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个（如果有）工具。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或多个
        工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定函数。

        - `name: string`

          要调用的函数的名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
          调用它的指导，以及在调用时该告诉用户什么的指导
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          JSON Schema 中函数的参数。

        - `type: optional "function"`

          该工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol 让模型访问额外工具
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

          允许的工具名称列表或筛选对象。

          - `McpAllowedTools = array of string`

            允许的工具名称字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
          自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
          必须处理 OAuth 授权流程并提供此处的令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

          当前支持的 `connector_id` 值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google 日历： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook 日历： `connector_outlookcalendar`
          - Outlook 邮箱： `connector_outlookemail`
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

          此 MCP 工具是否延迟并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要批准。可以是
            `always`, `never`，或与需要批准的工具关联的筛选器对象
            。

            - `always: optional object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一批准策略。以下之一 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
      为会话启用了 追踪，配置便无法修改。

      `auto` 将为会话创建带有默认值的 追踪，用于
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并为追踪配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        追踪的精细配置。

        - `group_id: optional string`

          要附加到此追踪的组 ID，以启用过滤和
          在追踪仪表板中进行分组。

        - `metadata: optional unknown`

          要附加到此追踪的任意元数据，以启用
          在追踪仪表板中进行过滤。

        - `workflow_name: optional string`

          要附加到此追踪的工作流名称。此名称用于
          在追踪仪表板中命名此追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

      客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

      截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

      可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

      - `"auto" or "disabled"`

        用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

        - `retention_ratio: number`

          当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

          - `post_instructions: optional number`

            指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。始终 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
          过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

          语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

            - `type: "server_vad"`

              轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

              如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，超过该时间后会自动触发模型响应。这
              对于用户长时间停顿属于意外情况（如电话
              通话）时非常有用。模型将根据当前上下文提示用户继续对话
              。

              超时值将在最后一条模型响应的音频播放完毕后应用，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              （与响应关联的）将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
              会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

              如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
              为 500 毫秒。值越短，模型响应越快，
              但可能会在用户短暂停顿时抢话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
              阈值越高，需要更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来确定用户何时说完话。

            - `type: "semantic_vad"`

              轮转检测的类型， `semantic_vad` 以开启语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断任何输出到默认
              会话（即。 `conversation` 的 `auto`）的进行中的响应。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      服务器输出中包含的其他字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### 返回

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元以来的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  实时或转录会话的会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    一个 Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
          过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

          语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

          语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

            - `type: "server_vad"`

              轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

              如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，超过该时间后会自动触发模型响应。这
              对于用户长时间停顿属于意外情况（如电话
              通话）时非常有用。模型将根据当前上下文提示用户继续对话
              。

              超时值将在最后一条模型响应的音频播放完毕后应用，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              （与响应关联的）将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
              会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

              如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
              为 500 毫秒。值越短，模型响应越快，
              但可能会在用户短暂停顿时抢话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
              阈值越高，需要更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来确定用户何时说完话。

            - `type: "semantic_vad"`

              轮转检测的类型， `semantic_vad` 以开启语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断任何输出到默认
              会话（即。 `conversation` 的 `auto`）的进行中的响应。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型口语响应速度相对于原始速度的倍数。
          1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

          此参数是音频生成后的后处理调整，它
          也可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
          便无法更改。当前
          可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
            便无法更改。当前
            可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      服务器输出中包含的其他字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

      请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出令牌数，
      包括工具调用。提供一个介于 1 和 4096 之间的整数，以
      限制输出令牌，或 `inf` 用于获取给定模型的
      最大可用令牌。默认为 `inf`.

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
      模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
      模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的值映射，用于替换你的
        提示中的变量。替换值可以是字符串，也可以是其他
        响应输入类型，如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          给模型的文本输入。

          - `text: string`

            给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `image_url: optional string or null`

            要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件的内容。

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `file_url: optional string`

            要发送给模型的文件的 URL。

          - `filename: optional string`

            要发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如）的推理投入
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。提供一种字符串模式，或强制指定某个
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个（如果有）工具。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或多个
        工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定函数。

        - `name: string`

          要调用的函数的名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
          调用它的指导，以及在调用时该告诉用户什么的指导
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          JSON Schema 中函数的参数。

        - `type: optional "function"`

          该工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol 让模型访问额外工具
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

          允许的工具名称列表或筛选对象。

          - `McpAllowedTools = array of string`

            允许的工具名称字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
          自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
          必须处理 OAuth 授权流程并提供此处的令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

          当前支持的 `connector_id` 值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google 日历： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook 日历： `connector_outlookcalendar`
          - Outlook 邮箱： `connector_outlookemail`
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

          此 MCP 工具是否延迟并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要批准。可以是
            `always`, `never`，或与需要批准的工具关联的筛选器对象
            。

            - `always: optional object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一批准策略。以下之一 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
      为会话启用了 追踪，配置便无法修改。

      `auto` 将为会话创建带有默认值的 追踪，用于
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并为追踪配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        追踪的精细配置。

        - `group_id: optional string`

          要附加到此追踪的组 ID，以启用过滤和
          在追踪仪表板中进行分组。

        - `metadata: optional unknown`

          要附加到此追踪的任意元数据，以启用
          在追踪仪表板中进行过滤。

        - `workflow_name: optional string`

          要附加到此追踪的工作流名称。此名称用于
          在追踪仪表板中命名此追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

      客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

      截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

      可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

      - `"auto" or "disabled"`

        用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

        - `retention_ratio: number`

          当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

          - `post_instructions: optional number`

            指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

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

      会话输入音频的配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转录模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
          VAD 表示模型将根据
          音频音量检测语音的开始和结束，并在用户语音结束时响应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到语音之前包含的音频量（以
            毫秒为单位）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            检测语音停止的静音持续时间（以毫秒为单位）。默认为
            为 500 毫秒。值越短，模型响应越快，
            但可能会在用户短暂停顿时抢话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
            阈值越高，需要更响亮的音频才能激活模型，
            因此在嘈杂环境中可能表现更好。

          - `type: optional string`

            轮次检测的类型，仅限 `server_vad` 当前已支持。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      服务器输出中包含的其他字段。

      - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

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

## 域类型

### 客户端密钥创建响应

- `ClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建会话和客户端密钥时的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    实时或转录会话的会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      一个 Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

            输入音频降噪配置。可设置为 `null` 以关闭。
            降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
            过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

            语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

            语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

              - `type: "server_vad"`

                轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超过该时间后会自动触发模型响应。这
                对于用户长时间停顿属于意外情况（如电话
                通话）时非常有用。模型将根据当前上下文提示用户继续对话
                。

                超时值将在最后一条模型响应的音频播放完毕后应用，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                （与响应关联的）将在达到超时时间时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
                会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

                如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
                毫秒为单位）。默认为 300 毫秒。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500 毫秒。值越短，模型响应越快，
                但可能会在用户短暂停顿时抢话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                阈值越高，需要更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时说完话。

              - `type: "semantic_vad"`

                轮转检测的类型， `semantic_vad` 以开启语义 VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在 VAD 开始事件发生时自动中断任何输出到默认
                会话（即。 `conversation` 的 `auto`）的进行中的响应。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型口语响应速度相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

            此参数是音频生成后的后处理调整，它
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
            便无法更改。当前
            可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
              便无法更改。当前
              可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

        会话的过期时间戳，以自纪元以来的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务器输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

        请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出令牌数，
        包括工具调用。提供一个介于 1 和 4096 之间的整数，以
        限制输出令牌，或 `inf` 用于获取给定模型的
        最大可用令牌。默认为 `inf`.

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
        模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
        模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的值映射，用于替换你的
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            给模型的文本输入。

            - `text: string`

              给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `image_url: optional string or null`

              要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件的内容。

            - `file_id: optional string or null`

              要发送给模型的文件的 ID。

            - `file_url: optional string`

              要发送给模型的文件的 URL。

            - `filename: optional string`

              要发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如）的推理投入
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供一种字符串模式，或强制指定某个
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个（如果有）工具。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个
          工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定函数。

          - `name: string`

            要调用的函数的名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
            调用它的指导，以及在调用时该告诉用户什么的指导
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            JSON Schema 中函数的参数。

          - `type: optional "function"`

            该工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol 让模型访问额外工具
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

            允许的工具名称列表或筛选对象。

            - `McpAllowedTools = array of string`

              允许的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
            自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
            必须处理 OAuth 授权流程并提供此处的令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 邮箱： `connector_outlookemail`
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

            此 MCP 工具是否延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要批准。可以是
              `always`, `never`，或与需要批准的工具关联的筛选器对象
              。

              - `always: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一批准策略。以下之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
        为会话启用了 追踪，配置便无法修改。

        `auto` 将为会话创建带有默认值的 追踪，用于
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并为追踪配置选项设置默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的精细配置。

          - `group_id: optional string`

            要附加到此追踪的组 ID，以启用过滤和
            在追踪仪表板中进行分组。

          - `metadata: optional unknown`

            要附加到此追踪的任意元数据，以启用
            在追踪仪表板中进行过滤。

          - `workflow_name: optional string`

            要附加到此追踪的工作流名称。此名称用于
            在追踪仪表板中命名此追踪。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

        客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

        截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

        可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

        - `"auto" or "disabled"`

          用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

          - `retention_ratio: number`

            当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

            - `post_instructions: optional number`

              指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

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

        会话输入音频的配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
            VAD 表示模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时响应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（以毫秒为单位）。默认为
              为 500 毫秒。值越短，模型响应越快，
              但可能会在用户短暂停顿时抢话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
              阈值越高，需要更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅限 `server_vad` 当前已支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元以来的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务器输出中包含的其他字段。

        - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `value: string`

    生成的客户端密钥值。

### Realtime 会话创建响应

- `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

  一个 Realtime 会话配置对象。

  - `id: string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

  - `object: "realtime.session"`

    对象类型。始终为 `realtime.session`.

    - `"realtime.session"`

  - `type: "realtime"`

    要创建的会话类型。始终 `realtime` 用于 Realtime API。

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

        输入音频降噪配置。可设置为 `null` 以关闭。
        降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
        过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录的配置，默认关闭，可设置为 `null` 以关闭一次启用后的转录。输入音频转录并非模型原生能力，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型听到的确切内容。客户端可可选地设置转录的语言和提示词，这些为转录服务提供额外指导。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

        语音轮次检测的配置，可以是服务器 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        服务器 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

        语义 VAD 更先进，使用语音轮次检测模型（结合 VAD）语义估计用户是否已说完，然后根据此概率动态设置超时。例如，如果用户音频以“呃嗯”结尾，模型将评分较低的轮次结束概率，并等待更长时间让用户继续说话。这有助于更自然的对话，但可能具有更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话中，语音轮次检测必须
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

          - `type: "server_vad"`

            轮转检测的类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，如果模型已在响应中，则可能无法创建响应。

            如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选超时时间，超过该时间后会自动触发模型响应。这
            对于用户长时间停顿属于意外情况（如电话
            通话）时非常有用。模型将根据当前上下文提示用户继续对话
            。

            超时值将在最后一条模型响应的音频播放完毕后应用，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            （与响应关联的）将在达到超时时间时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            是否在检测到 VAD 开始事件时自动中断（取消）任何正在进行的、输出到默认
            会话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则会取消响应，否则将继续直到完成。

            如果两者都 `create_response` 以及 `interrupt_response` 设置为 `false`，模型将不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
            毫秒为单位）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
            为 500 毫秒。值越短，模型响应越快，
            但可能会在用户短暂停顿时抢话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
            阈值越高，需要更响亮的音频才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来确定用户何时说完话。

          - `type: "semantic_vad"`

            轮转检测的类型， `semantic_vad` 以开启语义 VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待更长时间让用户继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在 VAD 开始事件发生时自动中断任何输出到默认
            会话（即。 `conversation` 的 `auto`）的进行中的响应。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型口语响应速度相对于原始速度的倍数。
        1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

        此参数是音频生成后的后处理调整，它
        也可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
        便无法更改。当前
        可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型至少使用过一次音频响应，语音在会话期间
          便无法更改。当前
          可用的语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐使用 `marin` 以及 `cedar` 以获得
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

    会话的过期时间戳，以自纪元以来的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    服务器输出中包含的其他字段。

    `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型生成期望的响应。可以指导模型关于响应内容和格式（例如“尽量简洁”、“态度友好”、“以下是好响应的示例”），以及音频行为（例如“语速快一点”、“在声音中加入情感”、“多笑一笑”）。模型不保证会遵循这些指令，但指令为模型提供了期望行为的引导。

    请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出令牌数，
    包括工具调用。提供一个介于 1 和 4096 之间的整数，以
    限制输出令牌，或 `inf` 用于获取给定模型的
    最大可用令牌。默认为 `inf`.

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
    模型将使用音频加转录文本进行响应。 `["text"]` 可用于使
    模型仅以文本响应。无法同时请求 `text` 以及 `audio` 两者。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的值映射，用于替换你的
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        给模型的文本输入。

        - `text: string`

          给模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送给模型的文件的 ID。

        - `image_url: optional string or null`

          要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送给模型的文件的内容。

        - `file_id: optional string or null`

          要发送给模型的文件的 ID。

        - `file_url: optional string`

          要发送给模型的文件的 URL。

        - `filename: optional string`

          要发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如）的推理投入
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。提供一种字符串模式，或强制指定某个
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个（如果有）工具。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或多个
      工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项强制模型调用特定函数。

      - `name: string`

        要调用的函数的名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项强制模型调用远程 MCP 服务器上的特定工具。

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
        调用它的指导，以及在调用时该告诉用户什么的指导
        （如果有的话）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        JSON Schema 中函数的参数。

      - `type: optional "function"`

        该工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol 让模型访问额外工具
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

        允许的工具名称列表或筛选对象。

        - `McpAllowedTools = array of string`

          允许的工具名称字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
        自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
        必须处理 OAuth 授权流程并提供此处的令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
        关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

        当前支持的 `connector_id` 值包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google 日历： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook 日历： `connector_outlookcalendar`
        - Outlook 邮箱： `connector_outlookemail`
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

        此 MCP 工具是否延迟并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要批准。可以是
          `always`, `never`，或与需要批准的工具关联的筛选器对象
          。

          - `always: optional object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定单一批准策略。以下之一 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
    为会话启用了 追踪，配置便无法修改。

    `auto` 将为会话创建带有默认值的 追踪，用于
    工作流名称、组 ID 和元数据。

    - `Auto = "auto"`

      启用追踪并为追踪配置选项设置默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的精细配置。

      - `group_id: optional string`

        要附加到此追踪的组 ID，以启用过滤和
        在追踪仪表板中进行分组。

      - `metadata: optional unknown`

        要附加到此追踪的任意元数据，以启用
        在追踪仪表板中进行过滤。

      - `workflow_name: optional string`

        要附加到此追踪的工作流名称。此名称用于
        在追踪仪表板中命名此追踪。

  - `truncation: optional RealtimeTruncation`

    当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

    客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

    截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

    可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

    - `"auto" or "disabled"`

      用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

      - `retention_ratio: number`

        当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

        - `post_instructions: optional number`

          指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

### Realtime 转录会话创建响应

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

    会话输入音频的配置。

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

        输入音频降噪的配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        转录模型的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
        VAD 表示模型将根据
        音频音量检测语音的开始和结束，并在用户语音结束时响应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          在 VAD 检测到语音之前包含的音频量（以
          毫秒为单位）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          检测语音停止的静音持续时间（以毫秒为单位）。默认为
          为 500 毫秒。值越短，模型响应越快，
          但可能会在用户短暂停顿时抢话。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
          阈值越高，需要更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

        - `type: optional string`

          轮次检测的类型，仅限 `server_vad` 当前已支持。

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元以来的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    服务器输出中包含的其他字段。

    - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime 转录会话轮次检测

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据
  音频音量检测语音的开始和结束，并在用户语音结束时响应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认为
    为 500 毫秒。值越短，模型响应越快，
    但可能会在用户短暂停顿时抢话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
    阈值越高，需要更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅限 `server_vad` 当前已支持。

# 会话

## 创建会话

**post** `/realtime/sessions`

创建一个临时的 API 令牌，用于客户端应用程序中的
Realtime API。可使用与
`session.update` 客户端事件相同的会话参数进行配置。

它响应一个会话对象，以及一个 `client_secret` 包含
可用临时 API 令牌的密钥，可用于认证浏览器客户端
以用于 Realtime API。

返回创建的 Realtime 会话对象，以及一个临时密钥。

### 请求体参数

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌在
    一分钟后过期。

  - `value: string`

    可在客户端环境中使用的临时密钥，用于认证与
    实时 API 的连接。请在客户端环境中使用此密钥，而不是
    标准的 API 令牌，后者应仅在 服务端使用。

- `input_audio_format: optional string`

  输入音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { model }`

  输入音频转录的配置，默认关闭，且可以
  设置为 `null` 在开启后关闭。输入音频转录并非模型的
  原生功能，因为模型直接消费音频。转录以异步方式运行，
  应视为粗略指导，
  而非模型所理解的表征。

  - `model: optional string`

    用于转录的模型。

- `instructions: optional string`

  预置到模型调用之前的默认系统指令（即系统消息）。此字段允许客户端指导模型产生期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现友好”、“以下是良好响应的示例”），以及音频行为（例如“快速说话”、“在声音中注入情感”、“经常笑”）。不保证模型会遵循这些指令，但它们为模型提供了期望行为的指导。
  请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

- `max_response_output_tokens: optional number or "inf"`

  单个助手响应的最大输出令牌数，
  包括工具调用。提供一个介于 1 和 4096 之间的整数，以
  限制输出令牌，或 `inf` 用于获取给定模型的
  最大可用令牌。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。要禁用音频，
  设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `output_audio_format: optional string`

  输出音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的值映射，用于替换你的
    提示中的变量。替换值可以是字符串，也可以是其他
    响应输入类型，如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      给模型的文本输入。

      - `text: string`

        给模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型。始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        要发送给模型的文件的 ID。

      - `image_url: optional string or null`

        要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌使用量。使用 `low` 实现更低成本的渲染，或 `high` 以更高品质渲染文件。默认值为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        要发送给模型的文件的内容。

      - `file_id: optional string or null`

        要发送给模型的文件的 ID。

      - `file_url: optional string`

        要发送给模型的文件的 URL。

      - `filename: optional string`

        要发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可重用提示前缀的确切结束。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `speed: optional number`

  模型语音回复的速度。1.0 为默认速度。0.25 是
  最低速度。1.5 为最高速度。此值只能在
  模型回合之间更改，不能在回复进行中更改。

- `temperature: optional number`

  模型的采样温度，限制在 [0.6, 1.2] 之间。默认值为 0.8。

- `tool_choice: optional string`

  模型选择工具的方式。选项为 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of object { description, name, parameters, type }`

  可供模型使用的工具（函数）。

  - `description: optional string`

    函数的描述，包括何时以及如何
    调用它的指导，以及在调用时该告诉用户什么的指导
    （如果有的话）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    JSON Schema 中函数的参数。

  - `type: optional "function"`

    该工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  追踪的配置选项。设置为 null 以禁用追踪。一旦
  为会话启用了 追踪，配置便无法修改。

  `auto` 将为会话创建带有默认值的 追踪，用于
  工作流名称、组 ID 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的精细配置。

    - `group_id: optional string`

      要附加到此追踪的组 ID，以启用过滤和
      在追踪仪表板中分组。

    - `metadata: optional unknown`

      要附加到此追踪的任意元数据，以启用
      在追踪仪表板中过滤。

    - `workflow_name: optional string`

      要附加到此追踪的工作流名称。此名称用于
      在追踪仪表板中为追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的令牌数超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个具有 4,096 个最大输出令牌的 32k 上下文模型在截断发生前只能包含 28,224 个令牌在上下文中。

  客户端可以配置截断行为，以使用较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

  截断会减少下一轮中的缓存令牌数量（破坏缓存），因为消息从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

  可以完全禁用截断，这意味着服务器永远不会截断，而是在对话超过模型的输入令牌限制时返回错误。

  - `"auto" or "disabled"`

    用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多轮之间分摊截断，这有助于改善缓存令牌的使用。

    - `retention_ratio: number`

      当对话超过输入令牌限制时，要保留的指令后对话令牌比例（`0.0` - `1.0`）。将此设置为 `0.8` 意味着消息将被丢弃，直到使用了最大允许令牌的 80%。这有助于减少截断的频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令（包括工具定义）之后会话中允许的最大令牌数。例如，设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将会发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据
  音频音量，并在用户语音结束时响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认为
    为 500 毫秒。值越短，模型响应越快，
    但可能会在用户短暂停顿时抢话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
    阈值越高，需要更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅限 `server_vad` 当前已支持。

- `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  模型用于响应的声音。支持的内置声音有
  `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
  `marin`，以及 `cedar`。你也可以提供带有
  `id`，例如 `{ "id": "voice_1234" }`。在会话期间，一旦模型至少用音频响应过一次，
  就无法更改语音。

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

  会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

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

      输入音频降噪的配置。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional object { language, languages, model, prompt }`

      输入音频转录配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测配置。

      - `prefix_padding_ms: optional number`

      - `silence_duration_ms: optional number`

      - `threshold: optional number`

      - `type: optional string`

        轮次检测的类型，仅限 `server_vad` 当前已支持。

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

  会话的过期时间戳，以自纪元以来的秒数表示。

- `include: optional array of "item.input_audio_transcription.logprobs"`

  服务器输出中包含的其他字段。

  - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  默认系统指令（即系统消息）会在模型调用前添加。
  此字段允许客户端引导模型产生预期的
  响应。可以指导模型关于响应内容和格式，
  （例如“要极其简洁”、“要友好”、“这里有一些好响应的例子”
  ）以及音频行为（例如“说话快一点”、“在语音中注入情感”、
  进入你的语音", "经常大笑")。指令不保证
  会被模型遵循，但为模型提供了关于
  期望行为的指导。

  并且它们会在会话开始时的
  事件中可见。 `session.created` 事件中可见。
  事件中可见。

- `max_output_tokens: optional number or "inf"`

  单个助手响应的最大输出令牌数，
  包括工具调用。提供一个介于 1 和 4096 之间的整数，以
  限制输出令牌，或 `inf` 用于获取给定模型的
  最大可用令牌。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string`

  此会话使用的 Realtime 模型。

- `object: optional string`

  对象类型。始终为 `realtime.session`.

- `output_modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。要禁用音频，
  设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `tool_choice: optional string`

  模型选择工具的方式。选项为 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of RealtimeFunctionTool`

  可供模型使用的工具（函数）。

  - `description: optional string`

    函数的描述，包括何时以及如何
    调用它的指导，以及在调用时该告诉用户什么的指导
    （如果有的话）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    JSON Schema 中函数的参数。

  - `type: optional "function"`

    该工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  追踪的配置选项。设置为 null 以禁用追踪。一旦
  为会话启用了 追踪，配置便无法修改。

  `auto` 将为会话创建带有默认值的 追踪，用于
  工作流名称、组 ID 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的精细配置。

    - `group_id: optional string`

      要附加到此追踪的组 ID，以启用过滤和
      在追踪仪表板中分组。

    - `metadata: optional unknown`

      要附加到此追踪的任意元数据，以启用
      在追踪仪表板中过滤。

    - `workflow_name: optional string`

      要附加到此追踪的工作流名称。此名称用于
      在追踪仪表板中为追踪命名。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据
  音频音量，并在用户语音结束时响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认为
    为 500 毫秒。值越短，模型响应越快，
    但可能会在用户短暂停顿时抢话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
    阈值越高，需要更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅限 `server_vad` 当前已支持。

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

## 域类型

### 会话创建响应

- `SessionCreateResponse object { id, audio, expires_at, 10 more }`

  一个 Realtime 会话配置对象。

  - `id: optional string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

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

        输入音频降噪的配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

      - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

        轮次检测配置。

        - `prefix_padding_ms: optional number`

        - `silence_duration_ms: optional number`

        - `threshold: optional number`

        - `type: optional string`

          轮次检测的类型，仅限 `server_vad` 当前已支持。

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

    会话的过期时间戳，以自纪元以来的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    服务器输出中包含的其他字段。

    - `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    默认系统指令（即系统消息）会在模型调用前添加。
    此字段允许客户端引导模型产生预期的
    响应。可以指导模型关于响应内容和格式，
    （例如“要极其简洁”、“要友好”、“这里有一些好响应的例子”
    ）以及音频行为（例如“说话快一点”、“在语音中注入情感”、
    进入你的语音", "经常大笑")。指令不保证
    会被模型遵循，但为模型提供了关于
    期望行为的指导。

    并且它们会在会话开始时的
    事件中可见。 `session.created` 事件中可见。
    事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出令牌数，
    包括工具调用。提供一个介于 1 和 4096 之间的整数，以
    限制输出令牌，或 `inf` 用于获取给定模型的
    最大可用令牌。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string`

    此会话使用的 Realtime 模型。

  - `object: optional string`

    对象类型。始终为 `realtime.session`.

  - `output_modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。要禁用音频，
    设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `tool_choice: optional string`

    模型选择工具的方式。选项为 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    可供模型使用的工具（函数）。

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指导，以及在调用时该告诉用户什么的指导
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      JSON Schema 中函数的参数。

    - `type: optional "function"`

      该工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

    追踪的配置选项。设置为 null 以禁用追踪。一旦
    为会话启用了 追踪，配置便无法修改。

    `auto` 将为会话创建带有默认值的 追踪，用于
    工作流名称、组 ID 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的精细配置。

      - `group_id: optional string`

        要附加到此追踪的组 ID，以启用过滤和
        在追踪仪表板中分组。

      - `metadata: optional unknown`

        要附加到此追踪的任意元数据，以启用
        在追踪仪表板中过滤。

      - `workflow_name: optional string`

        要附加到此追踪的工作流名称。此名称用于
        在追踪仪表板中为追踪命名。

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测的配置。可设置为 `null` 以关闭。服务端
    VAD 表示模型将根据
    音频音量，并在用户语音结束时响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到语音之前包含的音频量（以
      毫秒为单位）。默认为 300 毫秒。

    - `silence_duration_ms: optional number`

      检测语音停止的静音持续时间（以毫秒为单位）。默认为
      为 500 毫秒。值越短，模型响应越快，
      但可能会在用户短暂停顿时抢话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
      阈值越高，需要更响亮的音频才能激活模型，
      因此在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测的类型，仅限 `server_vad` 当前已支持。

# 转录会话

## 创建转录会话

**post** `/realtime/transcription_sessions`

创建一个临时的 API 令牌，用于客户端应用程序中的
专用于实时转录的 Realtime API。
可以使用与会话参数相同的配置 `transcription_session.update` 客户端事件相同的会话参数进行配置。

它响应一个会话对象，以及一个 `client_secret` 包含
可用临时 API 令牌的密钥，可用于认证浏览器客户端
以用于 Realtime API。

返回创建的 Realtime 转录会话对象，以及一个临时密钥。

### 请求体参数

- `include: optional array of "item.input_audio_transcription.logprobs"`

  转录中包含的项目集。当前可用的项目有：
  `item.input_audio_transcription.logprobs`

  - `"item.input_audio_transcription.logprobs"`

- `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

  输入音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
  对于 `pcm16`，输入音频必须是 24kHz 采样率、16 位 PCM、
  单声道（mono）且为小端字节序。

  - `"pcm16"`

  - `"g711_ulaw"`

  - `"g711_alaw"`

- `input_audio_noise_reduction: optional object { type }`

  输入音频降噪配置。可设置为 `null` 以关闭。
  降噪会在音频发送到 VAD 和模型之前，对输入音频缓冲区中的音频进行过滤。
  过滤音频可以通过改善对输入音频的感知，提高 VAD 和语音轮次检测的准确性（减少误报）以及模型性能。

  - `type: optional NoiseReductionType`

    降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

    - `"near_field"`

    - `"far_field"`

- `input_audio_transcription: optional AudioTranscription`

  输入音频转录的配置。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指导。

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转写文本前等待的时间。
    值越高可以提高转写准确度，但会增加延迟。
    仅在以下环境中支持： `gpt-realtime-whisper` 在 GA Realtime 会话中。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于指导输入音频转写的词语或短语。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在以下位置提供输入语言：
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    将提高准确度和降低延迟。

  - `languages: optional array of string`

    输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持方： `gpt-transcribe` 以及 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前选项为： `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。请使用 `gpt-4o-transcribe-diarize` 当您需要带说话人标签的说话人分离时。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    可选的文本，用于指导模型的风格或延续先前的音频
    片段。
    对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
    提示词不受支持， `gpt-realtime-whisper` 在 GA Realtime 会话中。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认为
    为 500 毫秒。值越短，模型响应越快，
    但可能会在用户短暂停顿时抢话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
    阈值越高，需要更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional "server_vad"`

    轮次检测的类型。仅 `server_vad` 目前支持转录会话。

    - `"server_vad"`

### 返回

- `client_secret: object { expires_at, value }`

  API 返回的临时密钥。仅当会话
  通过 REST API 在服务端创建时出现。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌在
    一分钟后过期。

  - `value: string`

    可在客户端环境中使用的临时密钥，用于认证与
    实时 API 的连接。请在客户端环境中使用此密钥，而不是
    标准的 API 令牌，后者应仅在 服务端使用。

- `input_audio_format: optional string`

  输入音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { language, languages, model, prompt }`

  转录模型的配置。

  - `language: optional string`

    输入音频的语言。

  - `languages: optional array of string`

    为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

  模型可以响应的模态集合。要禁用音频，
  设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据
  音频音量，并在用户语音结束时响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300 毫秒。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认为
    为 500 毫秒。值越短，模型响应越快，
    但可能会在用户短暂停顿时抢话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
    阈值越高，需要更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅限 `server_vad` 当前已支持。

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

## 域类型

### 转写会话创建响应

- `TranscriptionSessionCreateResponse object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

  一个新的 Realtime 转录会话配置。

  当会话通过 REST API 在服务端创建时，会话对象
  还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。此
  属性在会话通过 WebSocket API 更新时不出现。

  - `client_secret: object { expires_at, value }`

    API 返回的临时密钥。仅当会话
    通过 REST API 在服务端创建时出现。

    - `expires_at: number`

      令牌过期的时间戳。目前，所有令牌在
      一分钟后过期。

    - `value: string`

      可在客户端环境中使用的临时密钥，用于认证与
      实时 API 的连接。请在客户端环境中使用此密钥，而不是
      标准的 API 令牌，后者应仅在 服务端使用。

  - `input_audio_format: optional string`

    输入音频的格式。选项有 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

  - `input_audio_transcription: optional object { language, languages, model, prompt }`

    转录模型的配置。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

    模型可以响应的模态集合。要禁用音频，
    设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测的配置。可设置为 `null` 以关闭。服务端
    VAD 表示模型将根据
    音频音量，并在用户语音结束时响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到语音之前包含的音频量（以
      毫秒为单位）。默认为 300 毫秒。

    - `silence_duration_ms: optional number`

      检测语音停止的静音持续时间（以毫秒为单位）。默认为
      为 500 毫秒。值越短，模型响应越快，
      但可能会在用户短暂停顿时抢话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一个
      阈值越高，需要更响亮的音频才能激活模型，
      因此在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测的类型，仅限 `server_vad` 当前已支持。

# 翻译

# 客户端密钥

## 创建翻译客户端密钥

**post** `/realtime/translations/client_secrets`

创建 Realtime 翻译客户端密钥，并关联相应的翻译会话配置。

客户端密钥是短期令牌，可以传递给客户端应用，
例如 Web 前端或移动客户端，它授予对 Realtime
翻译 API 的访问权限，而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义的
TTL。

返回创建的客户端密钥和有效的翻译会话对象。
客户端密钥是类似以下格式的字符串： `ek_1234`.

### 请求体参数

- `session: RealtimeTranslationSessionCreateRequest`

  实时翻译会话配置。翻译会话持续流入源
  音频，并持续输出翻译后的音频及字幕增量。

  - `model: string`

    用于此会话的实时翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务器会发出
        `session.input_transcript.delta` 事件。翻译本身仍从
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期指客户端密钥在
  创建会话后不再有效的时间点。会话开始后可能
  在该时间之后继续。一个密钥可用于创建多个会话，
  直到过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，即 `seconds` 将添加到 `created_at` 客户端密钥的时间以产生过期时间戳。仅 `created_at` 当前已支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择一个介于 `10` 以及 `7200` (2小时)之间的值。如果未指定，默认值为600秒（10分钟）。

### 返回

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    Realtime 翻译会话。翻译会话会持续将输入的
    音频翻译为配置的输出语言。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `model: string`

      用于此会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` 用于 Realtime 翻译会话。

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
