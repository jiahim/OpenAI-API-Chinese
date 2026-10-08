# Calls

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 后追加 `.md` 来获取对应文档页面的 Markdown 版本。

## 接受调用

**post** `/realtime/calls/{call_id}/accept`

接收来电 SIP 呼叫并配置将用于
处理它的实时会话。

### 路径参数

- `call_id: string`

### 正文参数

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
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转录并非模型原生支持，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型听到的确切内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供了额外的指引。

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

        用于引导输入音频转写的词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式提供
        将提高准确度和降低延迟。

      - `languages: optional array of string`

        输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当需要 `gpt-4o-transcribe-diarize` 带说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当需要 `gpt-4o-transcribe-diarize` 带说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选的文本，用于引导模型的风格或延续之前的音频
        片段。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如“expect words related to technology”。
        以下模型不支持 prompt： `gpt-realtime-whisper` 在 GA Realtime 会话中使用。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可为 Server VAD 或 Semantic VAD。可将其设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用一个轮次检测模型（与 VAD 配合）来语义上估计用户是否已说完话，然后根据该概率动态设置超时。例如，如果用户音频以“uhhm”逐渐减弱，模型将给出一个较低的轮次结束评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须设置为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以启用简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则当模型已在响应时可能会无法创建响应。

          如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过后将自动触发模型响应。该参数适用于
          用户长时间停顿不符合预期的场景，例如电话通话。模型将根据当前上下文有效地提示用户继续对话，
          基于当前上下文提示用户继续对话。
          基于当前上下文。

          超时时间将在上一次模型响应的音频播放结束后开始计时，即它被设置为，
          ，即设置为上一次模型响应音频结束的时间加上音频播放时长。 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及与该响应相关的事件）将在达到超时时发出。
          相关的事件将在达到超时时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当发生 VAD start 事件时，是否自动中断（取消）正在进行的、输出到默认
          对话（即。 `conversation` 的 `auto`）的响应。如果为 `true` ，则响应将被取消；否则将继续执行直到完成。

          如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
          毫秒)。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
          500ms。使用较短的数值时，模型会更快地响应，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更响亮的音频才能激活模型，
          因此在嘈杂环境中表现可能更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待用户继续说话更长时间， `high` 会更快地响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8s、4s 和 2s 的最大超时时间。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在向默认设备输出时自动打断任何正在进行的响应
          对话（即。 `conversation` 的 `auto`) 当 VAD 开始事件发生时。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型口语响应速度相对于原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

      该参数是对生成后音频的后处理调整，也可以
      提示模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

      模型用于响应的语音。支持的内置语音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义语音对象，
      一个 `id`，例如 `{ "id": "voice_1234" }`。在会话过程中，一旦模型
      至少响应过一次音频，语音就无法更改。
      自定义语音必须由音频样本创建。
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

  服务端输出中要包含的附加字段。

  `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  模型调用前默认添加的系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型响应内容和格式（例如“极其简洁”、“表现得友好”、“下面是一些好的响应示例”），以及音频行为（例如“说得快一些”、“在声音中注入情感”、“经常笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

  请注意，服务端会设置默认指令，如果未设置该字段则将使用这些默认指令，这些指令在会话开始时的 `session.created` 事件中可见。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包含工具调用。提供 1 到 4096 之间的整数以
  限制输出 token 数，或 `inf` 给定模型的最大可用 token 数。默认值为
  给定模型的最大可用 token 数。默认值为 `inf`.

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
  模型将使用音频加文字转录进行响应。 `["text"]` 可用于让
  模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以并行调用多个工具。仅支持
  推理类 Realtime 模型，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示词模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示词模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的值映射，用于替换
    提示词中的变量。替换值可以是字符串，也可以是其他
    Response 输入类型，例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会向上取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图片输入。了解有关 [图片输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图片的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

        要发送给模型的图片的 URL。可以是完整的 URL，也可以是 data URL 中的 base64 编码图片。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会向上取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        要发送给模型的文件内容。

      - `file_id: optional string or null`

        要发送给模型的文件的 ID。

      - `file_url: optional string`

        要发送给模型的文件的 URL。

      - `filename: optional string`

        要发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会向上取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  适用于以下支持推理的 Realtime 模型的配置： `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制以下支持推理的 Realtime 模型的推理强度：
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型选择工具的方式。提供一种字符串模式，或强制指定特定
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（如果有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或多个工具之间进行选择
    更多工具。

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

      要使用的 MCP 服务器标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具名称。

- `tools: optional RealtimeToolsConfig`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数说明，包括何时以及如何
      调用它的指导，以及调用时告知用户什么的指导
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol 让模型能够访问额外的工具
    （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

    - `type: "mcp"`

      MCP 工具的类型。始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用的上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许使用的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或为只读。如果某个
          MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤条件。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可搭配自定义
      MCP 服务器 URL 或服务连接器使用。你的应用
      必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的那些。其一为
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器的信息 [请参阅此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段对于 2026 年 9 月 1 日之后发布的模型已弃用。
      使用 `server_url` 以连接到远程 MCP 服务器，或使用 `tunnel_id` 以
      通过安全 MCP 隧道进行连接。

      当前支持的 `connector_id` 值为：

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

      此 MCP 工具是否延迟加载并通过工具搜索发现。

    - `headers: optional map[string] or null`

      要发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，也可以是与需要审批的工具关联的筛选器对象
        。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一审批策略。以下之一： `always` 或
        `never`。设为 `always`，时，所有工具都需要审批。当
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

  实时 API可以将会话追踪写入 [追踪控制面板](https://platform.openai.com/logs?api=traces)。设为 null 可禁用追踪。一旦为会话启用
  追踪，就无法再修改该配置。

  `auto` 将为会话创建一个 追踪，并使用以下字段的默认值：
  工作流 名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用 追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对 追踪 进行细粒度配置。

    - `group_id: optional string`

      附加到此 追踪 的组 ID，用于在 Traces Dashboard 中启用筛选与
      分组功能。

    - `metadata: optional unknown`

      附加到此 追踪 的任意元数据，用于在 Traces Dashboard 中启用
      筛选功能。

    - `workflow_name: optional string`

      附加到此 trace追踪 的 工作流 名称。该名称用于
      在 Traces Dashboard 中命名该 追踪。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型在发生截断前，上下文中最多只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

  截断会减少下一轮对话中的已缓存 token 数（破坏缓存），因为消息会从上下文的开头被丢弃。但是，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 上限时，保留对话 token 的一部分。这允许你将截断分摊到多轮对话中，有助于提升已缓存 token 的使用效率。

    - `retention_ratio: number`

      在对话超过输入 token 上限时，保留指令后对话 token 的比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示在使用的令牌数达到允许的最大令牌的 80% 之前，消息将被丢弃。这有助于减少截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，则使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令（包括工具定义）之后，对话中允许的最大令牌数。例如，将其设置为 5,000 意味着当对话在指令之后超过 5,000 个令牌时将发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

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

结束一个进行中的 Realtime API 调用，无论它是通过 SIP 还是
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

使用 SIP REFER 方法将正在进行的 SIP 通话转接至新目的地。

### 路径参数

- `call_id: string`

### 正文参数

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

通过向主叫方返回 SIP 状态码来拒接来电 SIP 呼叫。

### 路径参数

- `call_id: string`

### 正文参数

- `status_code: optional number`

  发送给呼叫方的 SIP 响应代码。默认 `603` (Decline)
  时省略。

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
