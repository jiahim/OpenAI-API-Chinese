# Calls

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 接受通话

**post** `/realtime/calls/{call_id}/accept`

接听来电 SIP 请求，并配置用于处理该请求的实时会话
逻辑。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。始终为 `realtime` ，用于 Realtime API。

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
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，这些为转录服务提供了额外的指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时间。
        较高的值可以提高转写准确度，但会增加延迟。
        仅支持 `gpt-realtime-whisper` 在 GA Realtime 会话中使用。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`) 格式
        提供该信息将提升准确度并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选值包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选值包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`， [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如 "expect words related to technology"。
        以下模型不支持 prompt： `gpt-realtime-whisper` 在 GA Realtime 会话中使用。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 表示模型会根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义上判断用户是否已说完，并根据该概率动态设置超时时间。例如，如果用户音频以 "uhhm" 结尾，模型会给轮次结束打出较低的概率分，并等待更长时间以让用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须设置为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD stop 事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经在响应时可能会无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过后将自动触发模型响应。该设置
          适用于用户长时间停顿属于异常情况的场景，例如电话
          通话。模型将基于当前上下文有效地提示用户继续对话。
          基于当前上下文。

          该超时值将在最近一次模型响应的音频播放结束后开始计算，
          即设置为该 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
          ）将在到达超时时被发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当默认会话（即
          会话）出现输出时，是否自动中断（取消）任何正在进行的响应。 `conversation` 的 `auto`）当发生 VAD start 事件时。如果设为 `true` ，则响应将被取消，否则它将继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止所需的静音时长（以毫秒为单位）。默认
          为 500ms。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时结束发言。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 会等待更长时间以便用户继续说话， `high` 会更快做出响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8s、4s 和 2s 的最大超时时间。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在发生 VAD 开始事件时，使用输出自动中断默认扬声器上正在进行的响应。
          会话）出现输出时，是否自动中断（取消）任何正在进行的响应。 `conversation` 的 `auto`）当 VAD 开始事件发生时。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应的速度，是原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

      该参数是对生成后音频的后处理调整，也可以
      通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回应的语音。支持的内置语音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供一个自定义语音对象，例如
      一个 `id`，例如 `{ "id": "voice_1234" }`。语音在会话期间无法更改
      ，一旦模型至少响应过一次音频便不可更改。
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

  要在服务端输出中包含的附加字段。

  `item.input_audio_transcription.logprobs`：为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端指导模型生成所需的回应。可以指示模型的回应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好回应的示例”），以及音频行为（例如“说得快一些”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指导。

  请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，这些指令可在会话开始时的 `session.created` 事件中查看。

- `max_output_tokens: optional number or "inf"`

  单次助手回应的最大输出 token 数，
  包括工具调用在内。可提供 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示指定模型的最大可用 token 数。默认为
  给定模型的最大可用 token 数。默认为 `inf`.

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

  模型可以响应的模态集合。默认为 `["audio"]`,表示
  模型将返回音频以及文字转录。 `["text"]` 可用于让
  模型仅以文本形式响应。无法同时请求 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以并行调用多个工具。仅
  推理类 Realtime 模型支持,例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解详情](/docs/guides/text?api-mode=responses#reusable-prompts).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的值映射,用于替换你的
    提示中的变量。替换值可以是字符串,也可以是其他
    Response 输入类型,例如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

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

        发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可使用更低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

        标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制支持推理的 Realtime 模型的推理力度，例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型如何选择工具。可提供以下字符串模式之一，或强制使用特定
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成一条消息或调用一个或
    多个工具之间进行选择。

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

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指导，以及调用时向用户说明什么内容的指导
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      函数的参数，采用 JSON Schema 格式。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供更多工具。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

    - `server_label: string`

      该 MCP 服务器的标签，用于在工具调用中识别它。

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

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或为只读。如果某个
          MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，则它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，配合
      自定义 MCP 服务器 URL 或服务连接器使用。你的应用程序
      必须处理 OAuth 授权流程，并在此处提供该令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的服务连接器。必须提供以下值之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。详细了解
      服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

      目前支持 `connector_id` 以下值：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google 日历： `connector_googlecalendar`
      - Google 云端硬盘： `connector_googledrive`
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

      此 MCP 工具是否已延迟，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      要发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要批准。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要批准。可以是
        `always`, `never`，或与工具关联的筛选器对象
        需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一为 `always` 或
        `never`。当设置为 `always`，时,所有工具都需要审批。当设置为
        设置为 `never`，时,所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述,用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
      `tunnel_id` 是必填项。

    - `tunnel_id: optional string`

      要使用的安全 MCP 隧道 ID,用于替代直接的服务器 URL。可选值之一为
      `server_url`, `connector_id`，或 `tunnel_id` 是必填项。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦
  为某个会话启用了追踪，配置便不可修改。

  `auto` 会使用默认的
  工作流 名称、group id 和 metadata 为该会话创建一条追踪。

  - `Auto = "auto"`

    启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪 的细粒度配置。

    - `group_id: optional string`

      附加到该追踪 的 group id，用于在追踪仪表板中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到该追踪的任意元数据，以便在 Traces Dashboard 中启用筛选。
      filtering in the Traces Dashboard.

    - `workflow_name: optional string`

      附加到此工作流追踪的名称。此名称用于
      在 Traces Dashboard 中命名该追踪。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。上下文长度为 32k、最大输出 token 为 4,096 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

  客户端可以配置截断行为，以更低的 token 上限进行截断，这是控制 token 使用和成本的有效方法。

  截断会减少下一轮中缓存的 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。不过，客户端也可以将截断配置为保留最多占最大上下文一定比例的消息，从而减少后续截断的次数，并提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会进行截断，而是当对话超过模型的输入 token 上限时返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时返回错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 上限时，保留对话 token 的一部分。这允许你将截断分摊到多轮中，有助于改善缓存 token 的使用情况。

    - `retention_ratio: number`

      指令之后要保留的对话 token 比例（`0.0` - `1.0`）当对话超过输入 token 上限时。将其设置为 `0.8` 表示消息会被丢弃，直到剩余已使用的 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用按比例保留的截断方式。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。如果未提供，则使用模型的默认 token 上限。

      - `post_instructions: optional number`

        在指令（包括工具定义）之后，对话中允许的最大 token 数。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 个 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

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

通过 WebRTC 创建新的 Realtime API 调用，并获取完成对等连接所需的 SDP 应答
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

结束正在进行的 Realtime API 调用，无论该调用是通过 SIP 还是
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

使用 SIP REFER 动词将正在进行的 SIP 呼叫转接到新目的地。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应出现在 SIP Refer-To 标头中的 URI。支持以下值
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

通过向主叫方返回 SIP 状态码来拒绝接入的 SIP 呼叫。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  回传给呼叫方的 SIP 响应状态码。如果省略，则默认为 `603` (Decline)
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
