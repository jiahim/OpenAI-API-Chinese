> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 接听电话

**post** `/realtime/calls/{call_id}/accept`

接听来电 SIP 呼叫并配置将用于
处理该呼叫的实时会话。

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

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频缓冲区中的音频被发送给 VAD 和模型之前对其进行处理。
      对音频进行滤波可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生支持，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型实际听到的精确内容。客户端可选择设置转录的语言和提示词，这些为转录服务提供额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本前等待的时长。
        较高的值可以提高转写准确度，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 中的使用。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供
        可提高准确度并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格的可选文本，或用于延续上一段音频
        片段。
        对于 `whisper-1`,即 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型(不包括 `gpt-4o-transcribe-diarize`)时，prompt 是一个自由文本字符串,例如 "expect words related to technology"。
        Prompt 不支持 `gpt-realtime-whisper` 中的使用。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置,可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭,此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束,并在用户语音结束时进行响应。

      Semantic VAD 更为先进,它使用轮次检测模型(与 VAD 结合)来语义化地判断用户是否已说完,然后根据该概率动态设置超时时间。例如,如果用户音频以 "uhhm" 结尾,模型会判定轮次结束的概率较低,并等待更长时间以便用户继续说话。这对更自然的对话非常有用,但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中,轮次检测必须设置为
      设置为 `null`;不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测(VAD),在检测到用户语音时开启,并在一段静音后关闭。

        - `type: "server_vad"`

          轮次检测的类型, `server_vad` 可启用简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` 为 true,在模型已经在响应时,可能无法创建新的响应。

          如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          用于自动触发模型响应的可选超时。这在
          用户长时间停顿不符合预期的场景中非常有用，例如电话
          通话。模型实际上会基于当前上下文提示用户继续对话。
          当达到超时时间时，将根据当前上下文发出提示。

          超时值将在上一次模型响应的音频播放完毕后开始计算，
          即它的起点为上一次响应的结束 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及与 Response 关联的事件
          ）将在达到超时时被发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当默认会话（即
          会话）正在产生输出时，发生 VAD start 事件时是否自动中断（取消） `conversation` 正在进行的 `auto`）响应。如果为 true，则响应将被取消，否则它将继续直到完成。 `true` 则响应将被取消，否则它将继续执行直到完成。

          如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频时长（以
          毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静音时长（以毫秒为单位）。默认为
          500ms。该值越小，模型响应越快，但可能会在用户短暂的停顿时插话。
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的阈值要求更响亮的音频才能激活模型，因此
          更高的阈值需要更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时结束讲话。

        - `type: "semantic_vad"`

          轮次检测的类型, `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在向默认
          会话）正在产生输出时，发生 VAD start 事件时是否自动中断（取消） `conversation` 正在进行的 `auto`）时自动中断任何正在进行的响应。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应速度相对于原始速度的倍数。
      1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

      此参数是对生成后音频的后处理调整，
      也可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回应的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供一个自定义声音对象，
      一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少
      使用音频回应过一次后，会话期间便无法再更改声音。
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

        自定义声音参考。

        - `id: string`

          自定义声音 ID，例如 `voice_1234`.

- `include: optional array of "item.input_audio_transcription.logprobs"`

  服务端输出中要包含的额外字段。

  `item.input_audio_transcription.logprobs`：为输入音频转写包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型生成所需的回应。可以指示模型在回应内容和格式上的行为（例如“极其简洁”、“表现得友好一些”、“以下是优质回应的示例”），以及在音频行为上的表现（例如“说得快一点”、“在声音中加入情感”、“经常大笑”）。模型不保证会遵循这些指令，但它们为模型期望的行为提供了指引。

  请注意，服务端会设置默认指令，如果未设置此字段，将使用这些默认指令，它们可在会话开始时的 `session.created` 事件中查看。

- `max_output_tokens: optional number or "inf"`

  单次助手回应的最大输出 token 数，
  包含工具调用。请提供介于 1 到 4096 之间的整数以
  限制输出 token 数，或 `inf` 指定模型的最大可用 token 数。默认为
  指定模型的最大可用 token 数。默认为 `inf`.

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

  模型可响应的模态集合。默认值为 `["audio"]`,表示
  模型将同时返回音频和转录文本。 `["text"]` 可用于让
  模型仅返回文本。无法同时请求两者 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可并行调用多个工具。仅
  推理类 Realtime 模型支持,例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示词模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示词模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    用于替换你提示词中变量的可选值映射。
    替换值可以是字符串,也可以是其他
    Response 输入类型,例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      发送给模型的文本输入。

      - `text: string`

        发送给模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点会继承请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

        要发送给模型的图像 URL。可以是完整 URL，也可以是 data URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点会继承请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及以后的模型， `auto` 会使用高质量渲染，这可能会增加输入 token 用量。使用 `low` 可降低渲染成本，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

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

        要发送给模型的文件名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点会继承请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  适用于具备推理能力的 Realtime 模型的配置，例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    约束具备推理能力的 Realtime 模型的推理投入度，例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型如何选择工具。可提供以下字符串模式之一，或强制指定特定的
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（如果有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或
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
      调用它的指导，以及在调用时应向用户说明
      （的内容（如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      函数的参数，采用 JSON Schema 格式。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

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

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许使用的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据，或是否为只读。如果一个
          MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配该过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可配合
      自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须自行处理 OAuth 授权流程，并将令牌提供在此处。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。需提供以下值之一
      `server_url`, `connector_id`，或 `tunnel_id` 。了解更多
      关于服务连接器的 [信息](/api/docs/guides/tools-connectors-mcp#connectors).

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

      此 MCP 工具是否被延迟，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，也可以是与工具关联的筛选器对象
        需要审批的工具列表。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，或是否为只读。如果一个
            MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配该过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，或是否为只读。如果一个
            MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配该过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一的审批策略。可选值为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。必须提供以下之一： `server_url`, `connector_id`，或
      `tunnel_id` 。

    - `tunnel_id: optional string`

      用于代替直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 以禁用追踪。一旦为会话启用了
  追踪，配置便无法再修改。

  `auto` 会使用默认的追踪配置为该会话创建一个追踪，其中包含默认的
  工作流名称、group id 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终返回 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的 group id，用于在追踪仪表板中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在
      追踪仪表板中进行筛选。

    - `workflow_name: optional string`

      附加到此工作流的追踪名称。用于
      在追踪仪表板中为追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的令牌数量超过模型的输入令牌上限时，对话将被截断，这意味着最早的消息将不会被纳入模型的上下文。一个 32k 上下文的模型，若最大输出令牌为 4,096，则在发生截断前，上文中最多只能包含 28,224 个令牌。

  客户端可以配置截断行为，以更低的最大令牌数进行截断，这是一种控制令牌使用和成本的有效方式。

  截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文开头被丢弃。不过，客户端也可以将截断配置为最多保留至最大上下文大小一定比例的消息，从而减少未来截断的次数，进而提高缓存命中率。

  截断也可以整体禁用，此时若对话超出模型的输入令牌上限，服务端不会进行截断，而是返回错误。

  - `"auto" or "disabled"`

    用于此会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入令牌上限时返回错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入令牌上限时，保留对话令牌的一部分。这允许你将截断分摊到多轮中，有助于提高缓存令牌的使用效率。

    - `retention_ratio: number`

      超过输入令牌上限时，指令后对话令牌的保留比例（`0.0` - `1.0`）。当对话超过输入令牌上限时生效。将其设置为 `0.8` 意味着消息将被丢弃，直到使用的令牌数达到最大允许令牌的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令之后（包含工具定义）对话中允许的最大令牌数。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 个令牌时将发生截断。该值不能高于模型上下文窗口大小减去最大输出令牌数。

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
