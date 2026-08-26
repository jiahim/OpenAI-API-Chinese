# 调用

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 接受调用

**POST** `/realtime/calls/{call_id}/accept`

接受一个来电 SIP 呼叫，并配置将处理该呼叫的实时会话，该会话将
对其进行处理。

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
      降噪会在音频发送到 VAD 和模型之前，过滤添加到输入音频缓冲区中的音频。
      过滤音频可以提高 VAD 和语音轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近距离拾音麦克风，如耳机， `far_field` 适用于远场麦克风，如笔记本电脑或会议室的麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为输入音频内容的指导，而非模型确切听到的内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本前的等待时间。
        更高的值可以提升转录准确性，但会增加延迟。
        仅在 `gpt-realtime-whisper` 的正式版 Realtime 会话中受支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于指导输入音频转录的词语或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。以
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`)格式
        提供输入语言将提升准确性和降低延迟。

      - `languages: optional array of string`

        输入音频可能包含的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        可选文本，用于指导模型的风格或延续之前的音频
        片段。
        对于 `whisper-1`， [提示词是关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 的模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与科技相关的词汇”。
        提示词不支持与 `gpt-realtime-whisper` 的正式版 Realtime 会话中受支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      对话检测配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      服务端 VAD 表示模型将根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

      语义 VAD 更高级，使用对话检测模型（结合 VAD）来语义化估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以“嗯”结尾，模型会给出较低的对话结束概率，并等待更长时间让用户继续说话。这对更自然的对话可能有用，但可能有更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，对话检测必须
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          对话检测类型， `server_vad` 以启用简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，若模型已在响应中，则可能无法创建响应。

          如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发送。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。这对于
          用户长时间停顿出乎意料的情况非常有用，例如在电话
          通话中。模型将有效地提示用户基于当前
          上下文继续对话。

          超时值将在最后一个模型响应音频播放完毕后开始计算，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及与 Response 相关的
          事件）会在达到超时时被触发。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          是否在 VAD 开始事件发生时自动中断（取消）任何正在进行的、向默认
          对话输出（即。 `conversation` 的 `auto`）的响应。如果 `true` 则响应会被取消，否则将继续直至完成。

          如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发送。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
          毫秒）。默认值为 300 毫秒。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静音持续时间（以毫秒为单位）。默认
          为 500 毫秒。值越短，模型响应越快，
          但可能会在用户短暂停顿时打断。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。阈值
          越高，需要更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型判断用户是否已说完。

        - `type: "semantic_vad"`

          对话检测类型， `semantic_vad` 以开启语义 VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型响应的急切程度。值。 `low` 将等待用户更长时间继续说话， `high` 将更快响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8 秒、4 秒和 2 秒的最大超时时间。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在 VAD 开始事件发生时，自动中断任何正在进行的、正在向默认
          对话输出（即。 `conversation` 的 `auto`）输出内容的响应。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型口语响应的速度，为原始速度的倍数。
      1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

      此参数是对生成后音频的后处理调整，
      也可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于响应的语音。支持的内置语音为
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义语音对象，其中包含
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少用音频响应过一次，
      在此会话期间就不能再更改语音。
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

  服务端输出中要包含的其他字段。

  `item.input_audio_transcription.logprobs`：包含输入音频转录的对数概率。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  预置到模型调用中的默认系统指令（即系统消息）。此字段使客户端能够引导模型产生期望的响应。可以指导模型关于响应内容和格式（例如“极其简洁”“表现友好”“以下是一些良好响应的示例”），以及音频行为（例如“说得快些”“为你的声音注入情感”“经常笑”）。模型不一定会遵循这些指令，但它们为模型提供了期望行为的指导。

  请注意，服务器会设置默认指令；如果未设置此字段，将使用这些默认指令，并且这些指令在会话开始时的 `session.created` 事件中可见。

- `max_output_tokens: optional number or "inf"`

  单个助手响应的最大输出标记数，
  包括工具调用。提供一个介于 1 和 4096 之间的整数，以
  限制输出标记，或 `inf` 对于特定模型的最大可用令牌数
  ，默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

  本次会话所使用的 Realtime 模型。

  - `string`

  - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    本次会话所使用的 Realtime 模型。

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
  模型将返回音频和转录文本。 `["text"]` 可用于让
  模型仅返回文本。无法同时请求 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以并行调用多个工具。仅受
  推理型 Realtime 模型支持，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  提示词模板及其变量的引用。
  [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

  - `id: string`

    要使用的提示词模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    用于替换提示词中变量的可选值映射
    。替换值可以是字符串，也可以是其他
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

        标记可复用提示词前缀的确切结束位置。该断点从其请求中继承 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

        要发送给模型的文件的 ID。

      - `image_url: optional string or null`

        要发送给模型的图像的 URL。可以是完全限定的 URL 或 data URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示词前缀的确切结束位置。该断点从其请求中继承 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 以降低渲染成本，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

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

        标记可复用提示词前缀的确切结束位置。该断点从其请求中继承 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示词模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  支持推理的实时模型（如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    对支持推理的实时模型（如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型如何选择工具。提供以下字符串模式之一，或强制指定某个
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型是否调用工具以及调用哪些工具。

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

      要在服务器上调用的工具的名称。

- `tools: optional RealtimeToolsConfig`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用的指导，以及在调用时告诉用户的
      （内容（如有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      JSON Schema 中函数的参数。

    - `type: optional "function"`

      工具类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    （MCP）服务器为模型提供额外工具访问权限。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

    - `type: "mcp"`

      MCP 工具的类型。始终 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

      允许的工具名称列表或过滤器对象。

      - `McpAllowedTools = array of string`

        允许的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许工具的过滤器对象。

        - `read_only: optional boolean`

          指示工具是否修改数据或为只读。如果一个
          MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      一个 OAuth 访问令牌，可用于远程 MCP 服务器，既
      可用于自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，类似于 ChatGPT 中可用的那些。以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

      目前支持的 `connector_id` 值有：

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

      此 MCP 工具是否被延迟并通过工具搜索发现。

    - `headers: optional map[string] or null`

      要发送到 MCP 服务器的可选 HTTP 头。用于身份验证
      或其他目的。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤器对象
        需要审批的。

        - `always: optional object { read_only, tool_names }`

          用于指定允许工具的过滤器对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果一个
            MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许工具的过滤器对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果一个
            MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一的审批策略。可选用 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可选用 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      安全 MCP 隧道 ID，用于替代直接服务器 URL。可选用
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 以禁用 追踪。一旦
  为会话启用了 追踪，则无法修改配置。

  `auto` 将为会话创建一条 追踪，并使用默认的
  工作流名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用 追踪 并为 追踪配置选项设置默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      要附加到这条 追踪上的组 ID，以便在追踪仪表盘中进行筛选和
      分组。

    - `metadata: optional unknown`

      要附加到此追踪上的任意元数据，以便在
      追踪仪表板中进行筛选。

    - `workflow_name: optional string`

      要附加到此工作流的名称，用于
      在追踪仪表板中命名此追踪。

- `truncation: optional RealtimeTruncation`

  当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最旧的开始）将不会包含在模型的上下文中。一个32k上下文的模型，在截断发生前，若最大输出令牌为4,096，则仅能在上下文中包含28,224个令牌。

  客户端可以配置截断行为，以较低的令牌上限进行截断，这是控制令牌使用和成本的有效方式。

  截断将减少下一轮中缓存的令牌数量（破坏缓存），因为消息会从上下文开头被丢弃。然而，客户端也可以配置截断，以保留消息至最大上下文大小的一个比例，这将减少未来截断的需要，从而提高缓存命中率。

  截断可以被完全禁用，这意味着服务器将永不截断，但如果对话超过模型的输入令牌限制，则会返回错误。

  - `"auto" or "disabled"`

    会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入令牌限制时，保留一部分对话令牌。这允许你在多轮对话中分摊截断，有助于改善缓存令牌的使用。

    - `retention_ratio: number`

      当对话超过输入令牌限制时，要保留的指令后对话令牌的比例（`0.0` - `1.0`）。将其设置为 `0.8` 意味着将删除消息，直到使用到最大允许令牌的80%。这有助于减少截断的频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令后（包括工具定义）对话中允许的最大令牌数。例如，将其设置为5,000意味着当对话在指令后超过5,000个令牌时将发生截断。此值不能高于模型的上下文窗口大小减去最大输出令牌数。

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

## 挂断通话

**POST** `/realtime/calls/{call_id}/hangup`

结束一个活动的 Realtime API 调用，无论它是通过 SIP 还是
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

## 引用调用

**POST** `/realtime/calls/{call_id}/refer`

使用 SIP REFER 动词将活动的 SIP 通话转移到新目的地。

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

**POST** `/realtime/calls/{call_id}/reject`

通过向呼叫方返回 SIP 状态码来拒绝传入的 SIP 呼叫。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  要发送回调用方的 SIP 响应代码。默认为 `603` （拒绝）
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
