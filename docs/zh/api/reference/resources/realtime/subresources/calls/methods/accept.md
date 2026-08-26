> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 接受调用

**post** `/realtime/calls/{call_id}/accept`

接收入站 SIP 呼叫并配置将
处理它。

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

          音频的采样率。始终 `24000`.

          - `24000`

        - `type: optional "audio/pcm"`

          音频格式。始终 `audio/pcm`.

          - `"audio/pcm"`

      - `PCMUAudio object { type }`

        G.711 μ-law 格式。

        - `type: optional "audio/pcmu"`

          音频格式。始终 `audio/pcmu`.

          - `"audio/pcmu"`

      - `PCMAAudio object { type }`

        G.711 A-law 格式。

        - `type: optional "audio/pcma"`

          音频格式。始终 `audio/pcma`.

          - `"audio/pcma"`

    - `noise_reduction: optional object { type }`

      输入音频降噪的配置。可以设置为 `null` 以关闭。
      降噪会在音频被发送到 VAD 和模型之前，过滤添加到输入音频缓冲区中的音频。
      过滤音频可以通过改善对输入音频的感知，提高 VAD 和轮流检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪的类型。 `near_field` 适用于近讲麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转录并非模型的原生功能，因为模型直接消费音频。转录通过 [the /audio/transcriptions endpoint](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指导，而非模型实际听到的内容。客户端可以选择性地设置转录的语言和提示词，这些为转录服务提供额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本前等待的时间。
        较高的值可以提高转录准确性，但会增加延迟。
        仅在 `gpt-realtime-whisper` 的正式版 Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于指导输入音频转录的词语或短语。支持者： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
        将提高准确性和降低延迟。

      - `languages: optional array of string`

        输入音频的可能语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持者： `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选文本，用于指导模型的风格或延续先前的音频
        片段。
        对于 `whisper-1`，则 [提示词是关键字列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词语”。
        提示词不支持与 `gpt-realtime-whisper` 的正式版 Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮流检测配置，可以是Server VAD或Semantic VAD。可以设置为 `null` 以关闭，在这种情况下，客户端必须手动触发模型响应。

      Server VAD意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      Semantic VAD更高级，使用轮流检测模型（结合VAD）语义估算用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户音频以“嗯”淡出，模型将评分出较低的轮流结束概率，并等待更长时间让用户继续说话。这对于更自然的对话很有用，但可能会产生更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，轮流检测必须
      设置为 `null`；不支持VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），检测到用户语音时开启，静默一段时间后关闭。

        - `type: "server_vad"`

          轮流检测类型， `server_vad` 以开启简单的Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在VAD停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，若模型已经在响应，则可能无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选超时，超时后将自动触发模型响应。这在
          用户长时间停顿出乎意料的情况下非常有用，例如电话
          通话。模型将有效地提示用户根据
          当前上下文继续对话。

          超时值将在最后一个模型响应的音频播放完毕后应用，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及
          与响应关联的事件）将在达到超时时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          是否在 VAD 开始事件发生时自动中断（取消）任何正在进行的、输出到默认
          对话（即。 `conversation` 的 `auto`）的响应。如果 `true` 则响应将被取消，否则将继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音前要包含的音频量（以
          毫秒）。默认为 300 毫秒。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（毫秒）。默认值
          为 500 毫秒。使用较短的值时，模型响应会更快，
          但可能会在用户的短暂停顿时打断。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
          更高的阈值需要更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来确定用户何时说完话。

        - `type: "semantic_vad"`

          轮流检测类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在发生 VAD 停止事件时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 会等待用户更长时间继续说话， `high` 会更快地响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否自动中断任何正在进行的自动输出响应
          对话（即。 `conversation` 的 `auto`）当 VAD 起始事件发生时。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型口头响应的速度，以原始速度的倍数表示。
      1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。该值只能在模型轮次之间更改，不能在响应进行中更改。

      此参数是对生成的音频进行的后处理调整，
      也可以提示模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于响应的语音。支持的内置语音为
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义语音对象，包含
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少响应过一次音频，
      在会话期间就无法更改语音。
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

  服务器输出中要包含的其他字段。

  `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  预先附加到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型产生期望的响应。可以指示模型关于响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是一些良好响应的示例”）以及音频行为（例如“说得快些”、“为你的声音注入情感”、“经常大笑”）。模型不保证会遵循这些指令，但它们为模型提供了期望行为的指导。

  请注意，服务器会设置默认指令，如果未设置此字段，将使用这些默认指令，并且在 `session.created` 会话开始时会显示在事件中。

- `max_output_tokens: optional number or "inf"`

  单个助手响应的最大输出 token 数，
  包括工具调用。提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 对于特定模型可用的最大 token 数。默认值
  为 `inf`.

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

  模型可以响应的模态集合。默认值为 `["audio"]`，表示
  模型将以音频加转录文本的形式响应。 `["text"]` 可用于使
  模型仅以文本形式响应。无法同时请求 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以并行调用多个工具。仅受
  推理 Realtime 模型支持，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选映射，用于替换你的
    提示中的变量。替换值可以是字符串，或其他
    Response 输入类型，如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示词前缀的确切结尾。断点从其所属请求继承 TTL。 `prompt_cache_options.ttl`；该边界不按 token 块取整。

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

        发送给模型的文件的 ID。

      - `image_url: optional string or null`

        发送给模型的图像的 URL。可以是完整限定的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示词前缀的确切结尾。断点从其所属请求继承 TTL。 `prompt_cache_options.ttl`；该边界不按 token 块取整。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 以降低渲染成本，或使用 `high` 以更高品质渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        发送给模型的文件的内容。

      - `file_id: optional string or null`

        发送给模型的文件的 ID。

      - `file_url: optional string`

        发送给模型的文件的 URL。

      - `filename: optional string`

        发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示词前缀的确切结尾。断点从其所属请求继承 TTL。 `prompt_cache_options.ttl`；该边界不按 token 块取整。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示词模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    对支持推理的 Realtime 模型（例如）进行推理时的努力程度约束
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型如何选择工具。提供字符串模式之一，或强制指定某个
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个（如果有）工具。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以选择生成消息或调用一个或多个
    工具。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项强制模型调用特定的函数。

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

      要在服务器上调用的工具的名称。

- `tools: optional RealtimeToolsConfig`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指导，以及在调用时应该告知用户什么
      （如果有）的指导。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      函数在 JSON Schema 中的参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供额外工具的访问权限。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

      允许的工具名称列表或过滤器对象。

      - `McpAllowedTools = array of string`

        允许的工具名称字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤器对象。

        - `read_only: optional boolean`

          指示工具是否修改数据或为只读。如果某个
          MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，无论是
      使用自定义 MCP 服务器 URL 还是服务连接器。你的应用程序
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，类似于 ChatGPT 中可用的那些。
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

      当前支持 `connector_id` 的值为：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google 日历： `connector_googlecalendar`
      - Google 云端硬盘： `connector_googledrive`
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

      此 MCP 工具是否被延迟并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他目的。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的筛选器对象
        需要批准。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤器对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤器对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一批准策略。选项之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要批准。当
        设置为 `never`，时，所有工具都不需要批准。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。选项之一为 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      安全 MCP 隧道 ID，用于替代直接服务器 URL。选项之一为
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
  为会话启用了 追踪，则无法修改该配置。

  `auto` 将使用 追踪 为会话创建追踪，并为
  工作流 名称、组 ID 和元数据设置默认值。

  - `Auto = "auto"`

    启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    用于 追踪 的精细配置。

    - `group_id: optional string`

      要附加到此 追踪 的组 ID，用于启用筛选和
      在追踪仪表盘中进行分组。

    - `metadata: optional unknown`

      要附加到此追踪的任意元数据，以便在追踪仪表板中启用
      过滤。

    - `workflow_name: optional string`

      要附加到此工作流的追踪名称。此名称用于在追踪仪表板中
      对该追踪进行命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 限制时，对话将被截断，这意味着消息（从最早的开始）将不会包含在模型的上下文中。一个 32k 上下文的模型，若最大输出 token 为 4,096，则在发生截断前，上下文中只能包含 28,224 个 token。

  客户端可以配置截断行为，以较低的最大 token 限制进行截断，这是控制 token 使用量和成本的有效方式。

  截断将减少下一轮中的缓存 token 数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文大小一定比例的消息，这将减少未来截断的需求，从而提高缓存命中率。

  截断可以完全禁用，这意味着服务器将永远不会截断，而是在对话超过模型的输入 token 限制时返回错误。

  - `"auto" or "disabled"`

    会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 限制时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 限制时，保留对话 token 的一部分。这允许你将截断分摊到多个轮次，有助于改善缓存 token 的使用。

    - `retention_ratio: number`

      当对话超过输入 token 限制时要保留的指令后对话 token 的比例（`0.0` - `1.0`）。将其设置为 `0.8` 意味着将丢弃消息，直到使用的 token 达到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

      - `post_instructions: optional number`

        指令（包括工具定义）后对话中允许的最大 token 数。例如，将其设置为 5,000 意味着当对话在指令后超过 5,000 个 token 时会发生截断。此值不能高于模型的上下文窗口大小减去最大输出 token 数。

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
