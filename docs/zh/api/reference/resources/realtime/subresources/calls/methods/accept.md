> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 接受呼叫

**post** `/realtime/calls/{call_id}/accept`

接受来电 SIP 呼叫并配置将用于
处理该呼叫的实时会话。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。始终为 `realtime` 用于 Realtime API。

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
      降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提高 VAD 和轮次检测的准确性（减少误报），并提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供了额外的指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本前等待的时间。
        较高的值可以提高转写准确度，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 时受支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供该输入语言可提高准确度并降低延迟。
        ）格式中可以提高准确度并降低延迟。

      - `languages: optional array of string`

        输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带有说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` ，以便获得带有说话人标签的说话人分离。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带有说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` ，以便获得带有说话人标签的说话人分离。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选文本，用于引导模型的风格，或延续之前的音频
        片段。
        对于 `whisper-1`， [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 “expect words related to technology”。
        Prompt 不支持 `gpt-realtime-whisper` 时受支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以将其设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用一个轮次检测模型（与 VAD 结合）来语义化地判断用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以“uhhm”收尾，模型将给出较低的轮次结束概率评分，并等待更长时间以让用户继续说话。这有助于更自然的对话，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须设置为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测的类型， `server_vad` 以启用简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          当 VAD 停止事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时可能会导致无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永不自动响应，但 VAD 事件仍会发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，到期后将自动触发模型响应。这在
          用户长时间未说话属于意外情况时很有用，例如电话
          通话。模型将根据当前上下文实际提示用户继续对话。
          基于当前上下文。

          超时值将在最后一次模型响应的音频播放完毕后开始计算，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及与 Response 关联的事件
          ）将在达到超时时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否自动中断（取消）任何正在进行的响应，且输出到默认
          会话（即。 `conversation` 的 `auto`）。如果 `true` 则响应将被取消，否则将持续到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永不自动响应，但 VAD 事件仍会发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前包含的音频量（以
          毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止所需的静默时长（毫秒）。默认
          为 500ms。该值越小，模型响应越快，但，
          也可能在用户短暂的停顿处插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。阈
          值越高，激活模型所需的音频音量就越大，
          因此在嘈杂环境中表现可能更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时说完。

        - `type: "semantic_vad"`

          轮次检测的类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型的响应积极程度。 `low` 会等待用户继续说话的时间更长， `high` 响应会更迅速。 `auto` 为默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在 VAD 开始事件发生时自动中断任何正在进行的响应，并将输出发送至默认
          会话（即。 `conversation` 的 `auto`）。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应速度相对于原始速度的倍数。
      1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。该值只能在模型轮次之间更改，不能在响应进行中更改。

      此参数是对生成后音频的后处理调整，你
      也可以提示模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

      模型用于响应的语音。支持的内置语音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义语音对象，
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频响应，会话期间就
      无法更改语音。
      自定义语音必须由音频样本创建。
      我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

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

        自定义语音引用。

        - `id: string`

          自定义语音 ID，例如 `voice_1234`.

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在服务端输出中包含的附加字段。

  `item.input_audio_transcription.logprobs`：为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  预置到模型调用开头的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如，"请极其简洁"、"表现得友好"、"以下是优秀响应的示例"），以及音频行为（例如，"说话快一些"、"在声音中注入情感"、"经常笑"）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指导。

  请注意，服务端会设置默认指令，如果该字段未设置则会使用这些默认指令，它们会在会话开始时的 `session.created` 事件中可见。

- `max_output_tokens: optional number or "inf"`

  单个助手响应允许的最大输出 token 数，
  包含工具调用在内。提供一个介于 1 到 4096 之间的整数，以
  限制输出 token，或 `inf` 对于给定的模型使用最大可用 token
  。默认为 `inf`.

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

  模型可以响应的模态集合。默认为 `["audio"]`，表示
  模型将以音频加文字转录的方式进行响应。 `["text"]` 可用于使
  模型仅以文本形式响应。无法同时请求 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可并行调用多个工具。仅由
  推理类 Realtime 模型支持，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    在
    提示中要替换为变量的可选值映射。替换值可以是字符串，也可以是其他
    响应输入类型，如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      发送给模型的文本输入。

      - `text: string`

        发送给模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

        发送给模型的图片的 URL。完全限定的 URL 或在 data URL 中进行 base64 编码的图片。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 用量。使用 `low` 进行更低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  用于具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    约束具备推理能力的 Realtime 模型（例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型选择工具的方式。可传入字符串模式之一，或强制指定某个
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息和调用一个或
    多个工具之间选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用指定的函数。

    - `name: string`

      要调用的函数的名称。

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

      要在服务器上调用的工具的名称。

- `tools: optional RealtimeToolsConfig`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何调用它的指引，
      以及关于调用时应如何告知用户的指引
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      函数的参数，使用 JSON Schema 定义。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

    - `type: "mcp"`

      MCP 工具的类型，恒为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        一个字符串数组，列出允许使用的工具名称

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据，或者是否为只读。如果一个
          MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      一个 OAuth 访问令牌，可与远程 MCP 服务器一起使用，
      搭配自定义 MCP 服务器 URL 或服务连接器使用。你的应用
      必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的服务连接器。其中一项
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      对于 2026-09-01 之后发布的模型，此字段已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 用于
      通过安全 MCP 隧道连接。

      目前支持 `connector_id` 的值包括：

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

    - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要批准。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要批准。可以是
        `always`, `never`,也可以是与需要批准的工具相关联的筛选器对象
        需要批准的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，或者是否为只读。如果一个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，或者是否为只读。如果一个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值包括 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文信息。

    - `server_url: optional string`

      MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
      `tunnel_id` 之一。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
  为某个会话启用了 追踪，就无法再修改配置。

  `auto` 将为会话创建一个 追踪，并使用默认的
  工作流 名称、group id 和元数据。

  - `Auto = "auto"`

    启用 追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此 追踪 的 group id，用于在 Traces Dashboard 中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此 追踪 的任意元数据，用于在 Traces Dashboard 中启用
      筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的 工作流 名称。这用于
      在 Traces Dashboard 中为 追踪 命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，意味着最早的消息不会被纳入模型的上下文。一个 32k 上下文、最大输出 4,096 token 的模型，在发生截断之前只能在其上下文中包含 28,224 个 token。

  客户端可以配置截断行为，以较低的 token 上限进行截断，这是一种控制 token 用量和成本的有效方式。

  截断会减少下一轮中已缓存的 token 数量（破坏缓存），因为消息会从上下文开头被丢弃。不过，客户端也可以将截断配置为保留最多不超过最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

  截断可以完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将会返回错误。

  - `"auto" or "disabled"`

    用于此会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多个轮次，有助于提高已缓存 token 的使用率。

    - `retention_ratio: number`

      超出输入 token 上限时，要保留的指令后对话 token 的比例（`0.0` - `1.0`）。将其设置为 `0.8` 表示消息将被丢弃，直到使用了最大允许 tokens 的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

      - `post_instructions: optional number`

        在指令（包括工具定义）之后，对话中允许的最大 tokens 数。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 tokens 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 tokens。

### Example

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/accept \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "type": "realtime"
        }'
```

### Example

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
