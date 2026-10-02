# 调用

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾添加 `.md` 可获取文档页面的 Markdown 版本。

## 接受调用

**post** `/realtime/calls/{call_id}/accept`

接受来电 SIP 请求并配置用于
处理该通话的实时会话。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。始终为 `realtime` （用于 Realtime API）。

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
      降噪会在音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以提高 VAD 与打断检测的准确性（减少误报），并通过对输入音频感知效果的改善来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于头戴式等近讲话麦克风， `far_field` 适用于笔记本或会议室等远场麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在启用后关闭。输入音频转录并非模型内置，转录会通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，并应被视为对输入音频内容的参考，而非模型实际听到内容的精确记录。客户端可以可选地设置转录的语言和提示词，以为转录服务提供额外指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时间。
        较高的值可以提高转写准确度，但会增加延迟。
        仅在 GA Realtime 会话中支持使用 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的词语或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        将提升准确度并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带说话人标签的说话人分离时使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 带说话人标签的说话人分离时使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或承接上一段音频的可选文本
        片段。
        对于 `whisper-1`， [提示是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是一个自由文本字符串，例如 “expect words related to technology”。
        提示不支持 `gpt-realtime-whisper` 。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用一个轮次检测模型（与 VAD 配合）从语义上判断用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户音频以 “uhhm” 结尾，模型会给出较低的轮次结束概率，并等待更长时间以便用户继续说话。这在更自然的对话中很有用，但可能会有更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须设置为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD stop 事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，这可能会导致创建响应失败。

          如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，到时将自动触发模型响应。这在
          用户长时间停顿属于意外情况的场景下非常有用，例如电话
          通话。模型会根据当前上下文有效地提示用户继续对话，
          基于当前上下文。

          超时值将在上一次模型响应的音频播放结束后应用，
          即它被设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response
          相关的事件）将在达到超时时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）正在进行的、输出到默认
          会话的响应（即。 `conversation` 的 `auto`）。如果 `true` ，那么响应将被取消，否则它将继续直到完成。

          如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
          毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静音时长（毫秒）。默认为
          500ms。使用较小的值会让模型响应更快，
          但可能会抢在用户的短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
          较高的阈值要求更响亮的音频才能激活模型，因此
          在嘈杂环境下可能表现更佳。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时结束发言。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以便用户继续发言， `high` 会更快地做出响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8s、4s 和 2s 的最大超时。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当 VAD 启动事件发生时，是否使用输出自动打断任何正在进行的响应，发送到默认
          会话的响应（即。 `conversation` 的 `auto`）当 VAD 启动事件发生时。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应的速度，是原始速度的倍数。
      1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

      此参数是在音频生成完成后对其进行的后处理调整，可以
      通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回复的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用
      一个 `id`，提供自定义声音对象，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频回复过一次，
      会话期间就无法再更改声音。
      自定义声音必须由音频样本创建。仅 Live 支持由文本提示创建的声音。
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

  服务端输出中要包含的额外字段。

  `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式方面（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”）以及音频行为方面（例如“说得快一点”、“在声音中注入情感”、“经常笑”）的行为。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

  请注意，服务端会设置默认指令，如果未设置此字段，则会使用这些默认指令，这些指令在 `session.created` 会话开始时的事件中可见。

- `max_output_tokens: optional number or "inf"`

  单个助手响应的最大输出 token 数，
  包括工具调用。请提供一个介于 1 到 4096 之间的整数
  限制输出 tokens，或 `inf` 用于给定模型可用的最大 tokens 数。默认为
  给定模型。默认为 `inf`.

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

  模型可用于回复的模态集合。默认为 `["audio"]`,表示
  模型将同时返回音频和转录文本。 `["text"]` 可用于使
  模型仅以文本形式回复。无法同时请求两者 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以并行调用多个工具。仅
  推理类 Realtime 模型支持，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解详情](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的键值映射，用于替换你
    提示中的变量。替换值可以是字符串，也可以是其他
    响应输入类型，例如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。之一。默认为 `auto`.

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

        要发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        要发送给模型的文件内容。

      - `file_id: optional string or null`

        要发送给模型的文件 ID。

      - `file_url: optional string`

        要发送给模型的文件的 URL。

      - `filename: optional string`

        要发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  用于支持推理的 Realtime 模型的配置，例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制支持推理的 Realtime 模型（例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型选择工具的方式。提供以下字符串模式之一，或强制指定某个
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型将不调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息和调用一个或
    多个工具之间选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用某个特定函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可强制模型在远程 MCP 服务器上调用某个特定工具。

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

      函数的描述，包括何时以及如何调用它的
      指导，以及调用时告诉用户什么的指导
      （如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      函数的参数，采用 JSON Schema 格式。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器为模型提供额外的工具访问能力
    （服务器。 [详细了解 MCP](/api/docs/guides/tools-connectors-mcp).

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

        允许的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或为只读。如果某个
          MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，则会匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，适用于
      自定义 MCP 服务器 URL 或服务连接器。你的应用
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。取以下值之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。详细了解
      服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 通过
      安全 MCP 隧道进行连接。

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

      此 MCP 工具是否被延迟，是否通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，或与需要审批的工具关联的过滤器对象
        。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或为只读。如果某个
            MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或为只读。如果某个
            MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。必须提供以下之一 `server_url`, `connector_id`，或
      `tunnel_id` 。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 以禁用 追踪。一旦
  为某个会话启用了 追踪，配置便无法修改。

  `auto` 将为会话创建一个追踪，并使用默认值设置
  工作流名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    针对追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
      筛选。

    - `workflow_name: optional string`

      附加到此追踪追踪的工作流名称。这用于
      在 Traces Dashboard 中命名追踪。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着从最早的消息开始，部分消息不会包含在模型的上下文中。一个 32k 上下文模型，若最大输出 token 数为 4,096，则在发生截断前其上下文中只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

  截断会减少下一轮中缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。但是，客户端也可以将截断配置为保留最多为最大上下文大小一定比例的消息，从而减少未来截断的需要，进而提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将会返回错误。

  - `"auto" or "disabled"`

    会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时返回错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 上限时，保留对话 token 的一部分。这允许你在多轮之间分摊截断，有助于改善缓存 token 的使用情况。

    - `retention_ratio: number`

      当对话超过输入 token 上限时，保留指令后对话 token 的比例（`0.0` - `1.0`）。将其设置为 `0.8` 表示在达到最大允许 tokens 的 80% 之前消息将被丢弃。这有助于减少截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

      - `post_instructions: optional number`

        指令（包括工具定义）之后对话中允许的最大 tokens 数。例如，将其设置为 5,000 意味着当对话在指令后超过 5,000 tokens 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 tokens 数。

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

## Create call

**post** `/realtime/calls`

通过 WebRTC 创建新的 Realtime API 调用，并接收完成对等连接所需的 SDP answer
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

结束当前正在进行的 Realtime API 调用，无论该调用是通过 SIP 还是
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

使用 SIP REFER 动词将当前通话转接到新的目标地址。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应出现在 SIP Refer-To 头中的 URI。支持以下值
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

## 拒绝通话

**post** `/realtime/calls/{call_id}/reject`

通过向来电方返回 SIP 状态码来拒绝接听来电 SIP。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  发送回给调用方的 SIP 响应代码。如果省略，则默认为 `603` (Decline)
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
