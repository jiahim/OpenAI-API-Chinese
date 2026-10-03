# Realtime 客户端事件

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾附加 `.md` 。

这些是 OpenAI Realtime WebSocket 服务端会从客户端接收的事件。

<a id="session.update"></a>

## session.update

发送此事件以更新会话的配置。
客户端可随时发送此事件以更新任何字段
除了 `voice` 和 `model`. `voice` 之外，只有在尚无其他音频输出时才能更新。

当服务器收到 `session.update`，时，它会响应
一个 `session.updated` 事件，展示完整且生效的配置。
只有 `session.update` 中出现的字段会被更新。若要清除像这样的字段，
`instructions`，请传递空字符串。若要清除像这样的字段， `tools`，请传递空数组。
若要清除像这样的字段， `turn_detection`，请传递 `null`.

### Schema

Schema name: `RealtimeClientEventSessionUpdate`

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

          输入音频降噪的配置。可以将其设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，提高 VAD 和轮次检测的准确性（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可设置为 `null` 一旦开启后就关闭。输入音频转录并非模型的原生功能，因为模型直接消费音频。转录通过以下接口异步运行 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) ，应将其视为对输入音频内容的引导信息，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，这些会为转录服务提供额外的引导。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转录文本之前的等待时长。
            较高的值可以提升转录准确率，但会增加延迟。
            仅在 GA Realtime 会话中受支持 `gpt-realtime-whisper` 。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转录的单词或短语。支持以下模型 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在以下字段中提供输入语言
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            可以提升准确率和降低延迟。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持以下模型 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要带有说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要带有说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            可选的文本，用于引导模型的风格或延续上一段音频
            片段。
            对于 `whisper-1`，prompt 是一个 [关键词列表](https://developers.openai.com/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一段自由文本字符串，例如“期待与科技相关的词汇”。
            Prompt 不支持 `gpt-realtime-whisper` 。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以将其设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以“嗯”结尾，模型将为轮次结束打出较低概率的分，并等待更长时间以便用户继续发言。这在更自然的对话中很有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以启用简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` 如果模型已经在响应，这可能会导致无法创建响应。

              如果两者同时 `create_response` 和 `interrupt_response` 被设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时长，超过该时长后将自动触发模型响应。这在
              用户长时间停顿属于异常情况的场景下非常有用，例如电话
              通话。模型会根据当前上下文有效地提示用户继续对话，
              依据当前上下文。

              超时值将在上一次模型响应的音频播放完毕后开始计时，
              也就是说，它被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与 Response 关联
              的事件）将在达到超时时触发。
              空闲超时目前仅在 `server_vad` 模式下受支持。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）任何正在进行的、向默认
              对话发送输出的响应（即。 `conversation` 中的 `auto`）。如果 `true` 那么响应将被取消，否则将一直持续直到完成。

              如果两者同时 `create_response` 和 `interrupt_response` 被设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
              毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              较高的阈值要求更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束发言。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 响应会更迅速。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在默认扬声器输出时自动中断任何正在进行的响应
              对话发送输出的响应（即。 `conversation` 中的 `auto`) 在 VAD 起始事件发生时。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回复的速度，相对于原始速度的倍数。
          1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

          此参数是对生成后音频的后处理调整，你
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回复的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供一个自定义 voice 对象，其中包含
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在会话期间更改，
          一旦模型至少回复过一次音频后便无法更改。
          自定义声音必须通过音频样本创建。仅在 Live 中支持通过文本提示创建的声音。
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

            自定义声音参考。

            - `id: string`

              自定义声音 ID，例如 `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      默认的系统指令（即系统消息），会添加到模型调用之前。该字段允许客户端引导模型给出期望的回复。可以指示模型的回复内容和格式（例如“极度简洁”、“表现得友好”、“以下是一些良好回复的示例”），以及音频行为（例如“说话快一点”、“在声音中加入情绪”、“经常笑”）。指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指导。

      请注意，服务端会设置默认指令，如果未设置该字段将使用这些默认指令，且这些指令在 `session.created` 会话开始时的事件。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包含工具调用。提供 1 到 4096 之间的整数以
      限制输出 token 数，或 `inf` 以使用指定模型的最大可用 token 数。默认为
      给定模型的 `inf`.

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

      模型可以响应的模态集合。默认为 `["audio"]`，表示模型
      将以音频加上转录文本进行响应。 `["text"]` 可用于让模型仅
      以文本进行响应。不支持同时请求 `text` 和 `audio` 两者。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅由
      推理类 Realtime 模型（例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射值，用于替换你的
        提示中的变量。替换值可以是字符串，也可以是其他
        例如图片或文件等响应输入类型。

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

          发送给模型的图片输入。了解 [图片输入](https://developers.openai.com/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图片的细节等级。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

            发送给模型的图片的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图片。

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

            发送给模型的文件的细节等级。使用 `auto` 让系统选择细节等级；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 进行较低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送到模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `file_url: optional string`

            要发送到模型的文件的 URL。

          - `filename: optional string`

            要发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点会继承请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      用于支持推理的 Realtime 模型的配置，例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        对支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型选择工具的方式。选择以下字符串模式之一，或强制指定某个
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息和调用一个或
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

          函数的描述，包括何时以及如何调用它，以及在调用时应该告诉用户什么内容的指引
          （如有）。
          （如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          函数的参数，采用 JSON Schema 格式。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问
        （MCP）服务器。 [了解更多关于 MCP 的信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

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

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将与该过滤器匹配。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可搭配
          自定义 MCP 服务器 URL 或服务连接器使用。你的应用
          必须自行处理 OAuth 授权流程，并将令牌提供在此处。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解详情
          关于服务连接器的 [更多信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对于 2026 年 9 月 1 日之后发布的模型已被弃用。
          请使用 `server_url` 连接到远程 MCP 服务器，或使用 `tunnel_id` 通过
          安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google Calendar： `connector_googlecalendar`
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

          此 MCP 工具是否被延迟，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的筛选器对象
            需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将与该过滤器匹配。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将与该过滤器匹配。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。 `always` 其一：
            `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
            设置为 `never`，时，所有工具都将不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供其中一个。

        - `tunnel_id: optional string`

          要使用的安全 MCP 隧道 ID，用于代替直接服务器 URL。
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
      追踪在某个会话中启用，其配置便无法再修改。

      `auto` 将使用默认值（针对
      工作流名称、group id 和 metadata）为该会话创建一个追踪。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        用于追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪上的 group id，用于在 Traces Dashboard 中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪上的任意 metadata，用于在 Traces Dashboard 中进行
          筛选。

        - `workflow_name: optional string`

          附加到此追踪上的工作流名称。它用于
          在 Traces Dashboard 中为该追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息不会被纳入模型的上下文。以一个 32k 上下文、最大输出 token 为 4,096 的模型为例，在发生截断之前，其上下文中只能包含 28,224 个 token。

      客户端可以配置截断行为，以较低的 max token 上限进行截断，这是一种控制 token 使用量和成本的有效方式。

      截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息会从上下文的开头开始被丢弃。不过，客户端也可以将截断行为配置为保留不超过最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提升缓存命中率。

      截断也可以完全禁用，这意味着服务端永远不会进行截断，而是会在对话超过模型的输入 token 上限时返回错误。

      - `"auto" or "disabled"`

        该会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 限制时，保留一定比例的对话 token。这样可以跨多个回合摊销截断，有助于提升缓存 token 的利用率。

        - `retention_ratio: number`

          当对话超过输入 token 限制时，需保留的指令后对话 token 比例（`0.0` - `1.0`）。当该值设为 `0.8` 时，会持续丢弃消息，直至已使用 token 降至最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

          - `post_instructions: optional number`

            指令后（包含工具定义）对话中允许的最大 token 数。例如，将其设为 5,000 表示当指令后对话超过 5,000 token 时将进行截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。对于 Realtime API 始终为 `transcription` 用于转录会话的设置。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可以将其设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，提高 VAD 和轮次检测的准确性（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可设置为 `null` 一旦开启后就关闭。输入音频转录并非模型的原生功能，因为模型直接消费音频。转录通过以下接口异步运行 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) ，应将其视为对输入音频内容的引导信息，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，这些会为转录服务提供额外的引导。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以将其设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后基于该概率动态设置超时时间。例如，如果用户音频以“嗯”结尾，模型将为轮次结束打出较低概率的分，并等待更长时间以便用户继续发言。这在更自然的对话中很有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以启用简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` 如果模型已经在响应，这可能会导致无法创建响应。

              如果两者同时 `create_response` 和 `interrupt_response` 被设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时长，超过该时长后将自动触发模型响应。这在
              用户长时间停顿属于异常情况的场景下非常有用，例如电话
              通话。模型会根据当前上下文有效地提示用户继续对话，
              依据当前上下文。

              超时值将在上一次模型响应的音频播放完毕后开始计时，
              也就是说，它被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与 Response 关联
              的事件）将在达到超时时触发。
              空闲超时目前仅在 `server_vad` 模式下受支持。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）任何正在进行的、向默认
              对话发送输出的响应（即。 `conversation` 中的 `auto`）。如果 `true` 那么响应将被取消，否则将一直持续直到完成。

              如果两者同时 `create_response` 和 `interrupt_response` 被设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位：
              毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（单位：毫秒）。默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              较高的阈值要求更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束发言。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 响应会更迅速。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在默认扬声器输出时自动中断任何正在进行的响应
              对话发送输出的响应（即。 `conversation` 中的 `auto`) 在 VAD 起始事件发生时。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

- `type: "session.update"`

  事件类型，必须为 `session.update`.

  - `"session.update"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。该 ID 是客户端可自行指定的任意字符串。如果该事件发生错误，ID 会被传回，但对应的 `session.updated` 事件不会包含该 ID。

### 示例

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "instructions": "You are a creative assistant that helps with design tasks.",
    "tools": [
      {
        "type": "function",
        "name": "display_color_palette",
        "description": "Call this function when a user asks for a color palette.",
        "parameters": {
          "type": "object",
          "properties": {
            "theme": {
              "type": "string",
              "description": "Description of the theme for the color scheme."
            },
            "colors": {
              "type": "array",
              "description": "Array of five hex color codes based on the theme.",
              "items": {
                "type": "string",
                "description": "Hex color code"
              }
            }
          },
          "required": [
            "theme",
            "colors"
          ]
        }
      }
    ],
    "tool_choice": "auto"
  }
}
```

<a id="input_audio_buffer.append"></a>

## input_audio_buffer.append

发送该事件以向输入音频缓冲区追加音频字节。音频
缓冲区是可写入的临时存储，之后可以提交。“提交”会基于缓冲区内容在
对话历史中创建一条新的用户消息项，并清空缓冲区。
输入音频转录（如果启用）将在缓冲区提交时生成。

如果启用了 VAD，音频缓冲区将用于检测语音，并由服务端决定
何时提交。当服务端 VAD 被禁用时，你必须手动提交音频缓冲区。
输入音频降噪会在写入音频缓冲区时生效。

客户端可以自行决定每个事件放入多少音频，最大为
15 MiB，例如从客户端流式发送较小的分片可以使
VAD 响应更加及时。与大多数其他客户端事件不同，服务端
不会针对该事件发送确认响应。

### Schema

Schema name: `RealtimeClientEventInputAudioBufferAppend`

- `audio: string`

  Base64 编码的音频字节。该字节必须采用会话配置中由 output_format 字段指定的格式。
  `input_audio_format` 字段在会话配置中指定。

- `type: "input_audio_buffer.append"`

  事件类型，必须为 `input_audio_buffer.append`.

  - `"input_audio_buffer.append"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

### 示例

```json
{
    "event_id": "event_456",
    "type": "input_audio_buffer.append",
    "audio": "Base64EncodedAudioData"
}
```

<a id="input_audio_buffer.commit"></a>

## input_audio_buffer.commit

发送此事件以提交用户输入音频缓冲区,这将在对话中创建一个新的用户消息条目。如果输入音频缓冲区为空,该事件将报错。在 Server VAD 模式下,客户端无需发送此事件,服务器会自动提交音频缓冲区。

提交输入音频缓冲区将触发输入音频转录(如果在会话配置中启用了该功能),但不会由模型生成响应。服务器将返回一个 `input_audio_buffer.committed` 事件。

### Schema

Schema name: `RealtimeClientEventInputAudioBufferCommit`

- `type: "input_audio_buffer.commit"`

  事件类型，必须为 `input_audio_buffer.commit`.

  - `"input_audio_buffer.commit"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

### 示例

```json
{
    "event_id": "event_789",
    "type": "input_audio_buffer.commit"
}
```

<a id="input_audio_buffer.clear"></a>

## input_audio_buffer.clear

发送此事件以清除缓冲区中的音频字节。服务器将
响应一个 `input_audio_buffer.cleared` 事件。

### Schema

Schema name: `RealtimeClientEventInputAudioBufferClear`

- `type: "input_audio_buffer.clear"`

  事件类型，必须为 `input_audio_buffer.clear`.

  - `"input_audio_buffer.clear"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

### 示例

```json
{
    "event_id": "event_012",
    "type": "input_audio_buffer.clear"
}
```

<a id="conversation.item.create"></a>

## conversation.item.create

向会话的上下文中添加一个新 Item，包括消息、函数
调用和函数调用响应。该事件既可用于填充会话的
“历史”记录，也可在中途添加新项，但存在一个
当前的限制：无法填充助手音频消息。

如果成功，服务端将发出一个 `conversation.item.added` 事件，并且，
在该项完成时，会发出一个 `conversation.item.done` 事件。否则，将发送一个
`error` 事件。

### Schema

Schema name: `RealtimeClientEventConversationItemCreate`

- `item: ConversationItem`

  Realtime 对话中的单个 item。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任意时刻添加。对于会话行为上的重大更改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。对于系统消息始终为 `input_text` 。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      item 的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息 item。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（对于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（对于 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（用于 `input_text`).

      - `transcript: optional string`

        音频的转录文本（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      item 的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    实时对话中的一条助手消息项。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的转录文本，如果输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 其一： `output_audio` 取决于会话 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      item 的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    实时对话中的一项函数调用项。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      item 的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    实时对话中的一项函数调用输出项。

    - `call_id: string`

      此输出所对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

    - `type: "function_call_output"`

      item 的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的实时项。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回应的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      item 的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      可选的决策原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        有关该工具的其他注解。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      item 的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    表示对 MCP 服务器上某工具进行调用的 Realtime 项。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      所运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      item 的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联的批准请求的 ID（如果有）。

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

    请求人工批准工具调用的 Realtime 项。

    - `id: string`

      批准请求的唯一 ID。

    - `arguments: string`

      工具参数的 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      item 的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.create"`

  事件类型，必须为 `conversation.item.create`.

  - `"conversation.item.create"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

- `previous_item_id: optional string`

  新项将插入到其之后的上一项的 ID。如果未设置，新项将追加到对话末尾。

  如果设置为 `root`,新项将添加到对话开头。

  如果设置为现有的 ID，则允许在对话中间插入一项。如果找不到该 ID，将返回错误，并且不会添加该项。

### 示例

```json
{
  "type": "conversation.item.create",
  "item": {
    "type": "message",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "hi"
      }
    ]
  }
}
```

<a id="conversation.item.retrieve"></a>

## conversation.item.retrieve

当你想要检索服务器对会话历史中特定条目的表示时，发送此事件。例如，它可用于在降噪和 VAD 之后检查用户音频。
服务器将使用一个 `conversation.item.retrieved` 事件进行响应，
除非该条目不存在于会话历史中，此时
服务器将返回错误。

### Schema

Schema name: `RealtimeClientEventConversationItemRetrieve`

- `item_id: string`

  要检索的项的 ID。

- `type: "conversation.item.retrieve"`

  事件类型，必须为 `conversation.item.retrieve`.

  - `"conversation.item.retrieve"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

### 示例

```json
{
    "event_id": "event_901",
    "type": "conversation.item.retrieve",
    "item_id": "item_003"
}
```

<a id="conversation.item.truncate"></a>

## conversation.item.truncate

发送此事件以截断上一条助手消息的音频。服务器
将以快于实时的速度生成音频，因此当用户
中断以截断已发送到客户端但尚未播放的音频时，此事件非常有用。
这将使服务端对音频的理解与
客户端的播放保持一致。

截断音频将删除 服务端 文本转录，以确保上
下文环境中不会出现用户尚未听到的文本。

如果成功，服务器将返回 `conversation.item.truncated`
事件。

### Schema

Schema name: `RealtimeClientEventConversationItemTruncate`

- `audio_end_ms: number`

  音频截断的包含性时长上限（毫秒）。若
  audio_end_ms 大于实际音频时长，服务端
  将返回错误。

- `content_index: number`

  要截断的内容部分的索引。将其设置为 `0`.

- `item_id: string`

  要截断的助手消息项的 ID。仅助手消息
  项可被截断。

- `type: "conversation.item.truncate"`

  事件类型，必须为 `conversation.item.truncate`.

  - `"conversation.item.truncate"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

### 示例

```json
{
    "event_id": "event_678",
    "type": "conversation.item.truncate",
    "item_id": "item_002",
    "content_index": 0,
    "audio_end_ms": 1500
}
```

<a id="conversation.item.delete"></a>

## conversation.item.delete

当你想从对话历史中移除任何条目时发送该事件
。服务端将响应一个 `conversation.item.deleted` 事件进行响应，
除非该条目不存在于会话历史中，此时
服务器将返回错误。

### Schema

Schema name: `RealtimeClientEventConversationItemDelete`

- `item_id: string`

  要删除的项的 ID。

- `type: "conversation.item.delete"`

  事件类型，必须为 `conversation.item.delete`.

  - `"conversation.item.delete"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

### 示例

```json
{
    "event_id": "event_901",
    "type": "conversation.item.delete",
    "item_id": "item_003"
}
```

<a id="response.create"></a>

## response.create

此事件指示服务端创建一个 Response，即触发
模型推理。在 Server VAD 模式下，服务端会自动创建 Responses
。

一个 Response 将至少包含一个 Item，也可能包含两个，此时
第二个将是一个函数调用。这些 Item 默认会被追加到
对话历史中。

服务器将使用一个 `response.created` 事件、各 Item
和已创建内容的事件，以及最终的 `response.done` 事件，指示
Response 已完成。

该 `response.create` 事件包含推理配置，例如
`instructions` 和 `tools`。如果设置了这些参数，则仅在本 Response 中覆盖 Session 的
配置。

Response 可以在默认 Conversation 之外创建，这意味着它们可以
使用任意输入，并且可以禁止将输出写入 Conversation。
同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以并行创建多个
Response。 `metadata` 字段是区分
多个同时存在的 Response 的好方法。

客户端可以设置 `conversation` 以 `none` 以创建一个不会写入默认
会话的 Response。可以通过 `input` 字段提供任意输入，该字段是一个接受
原始 Item 和对现有 Item 的引用的数组。

### Schema

Schema name: `RealtimeClientEventResponseCreate`

- `type: "response.create"`

  事件类型，必须为 `response.create`.

  - `"response.create"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

- `response: optional RealtimeResponseCreateParams`

  使用这些参数创建一个新的 Realtime response

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

        模型用于回复的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供一个自定义 voice 对象，其中包含
        一个 `id`，例如 `{ "id": "voice_1234" }`。声音不能在会话期间更改，
        一旦模型至少回复过一次音频后便无法更改。
        自定义声音必须通过音频样本创建。仅在 Live 中支持通过文本提示创建的声音。
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

          自定义声音参考。

          - `id: string`

            自定义声音 ID，例如 `voice_1234`.

  - `conversation: optional string or "auto" or "none"`

    控制将响应添加到哪个会话。当前支持
    `auto` 和 `none`，默认值为 `auto` 。该 `auto` 值
    表示响应的内容将添加到默认
    会话。将其设置为 `none` 以创建一个不会向默认会话添加项目的
    带外响应。

    - `string`

    - `"auto" or "none"`

      控制将响应添加到哪个会话。当前支持
      `auto` 和 `none`，默认值为 `auto` 。该 `auto` 值
      表示响应的内容将添加到默认
      会话。将其设置为 `none` 以创建一个不会向默认会话添加项目的
      带外响应。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    包含在模型提示中的输入项目。使用此字段
    会为该 Response 创建一个新上下文，而不是使用默认
    会话。空数组 `[]` 将清除该 Response 的上下文。
    请注意，这可以包含对先前出现在会话中的项目的引用
    ，通过它们的 id。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任意时刻添加。对于会话行为上的重大更改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息 item。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（对于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 其一： `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回应的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某工具进行调用的 Realtime 项。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的批准请求的 ID（如果有）。

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

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    默认的系统指令（即系统消息）会添加到模型调用之前。该字段允许客户端引导模型给出期望的响应。可以指示模型响应内容和格式（例如“保持极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常大笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了指导。
    请注意，服务端会设置默认指令，如果未设置该字段将使用这些默认指令，且这些指令在 `session.created` 会话开始时的事件。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包含工具调用。提供 1 到 4096 之间的整数以
    限制输出 token 数，或 `inf` 以使用指定模型的最大可用 token 数。默认为
    给定模型的 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，并通过
    API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前可能的取值仅有
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    输出设置为 mode `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅由
    推理类 Realtime 模型（例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射值，用于替换你的
      提示中的变量。替换值可以是字符串，也可以是其他
      例如图片或文件等响应输入类型。

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

        发送给模型的图片输入。了解 [图片输入](https://developers.openai.com/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图片的细节等级。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

          发送给模型的图片的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图片。

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

          发送给模型的文件的细节等级。使用 `auto` 让系统选择细节等级；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 进行较低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送到模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `file_url: optional string`

          要发送到模型的文件的 URL。

        - `filename: optional string`

          要发送到模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点会继承请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    用于支持推理的 Realtime 模型的配置，例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      对支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型选择工具的方式。选择以下字符串模式之一，或强制指定某个
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息和调用一个或
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

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何调用它，以及在调用时应该告诉用户什么内容的指引
        （如有）。
        （如有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        函数的参数，采用 JSON Schema 格式。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问
      （MCP）服务器。 [了解更多关于 MCP 的信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

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

        允许使用的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将与该过滤器匹配。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可搭配
        自定义 MCP 服务器 URL 或服务连接器使用。你的应用
        必须自行处理 OAuth 授权流程，并将令牌提供在此处。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。了解详情
        关于服务连接器的 [更多信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

        此字段对于 2026 年 9 月 1 日之后发布的模型已被弃用。
        请使用 `server_url` 连接到远程 MCP 服务器，或使用 `tunnel_id` 通过
        安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的值包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google Calendar： `connector_googlecalendar`
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

        此 MCP 工具是否被延迟，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的筛选器对象
          需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将与该过滤器匹配。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将与该过滤器匹配。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。 `always` 其一：
          `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
          设置为 `never`，时，所有工具都将不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供其中一个。

      - `tunnel_id: optional string`

        要使用的安全 MCP 隧道 ID，用于代替直接服务器 URL。
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

### 示例

```json
// Trigger a response with the default Conversation and no special parameters
{
  "type": "response.create",
}

// Trigger an out-of-band response that does not write to the default Conversation
{
  "type": "response.create",
  "response": {
    "instructions": "Provide a concise answer.",
    "tools": [], // clear any session tools
    "conversation": "none",
    "output_modalities": ["text"],
    "metadata": {
      "response_purpose": "summarization"
    },
    "input": [
      {
        "type": "item_reference",
        "id": "item_12345"
      },
      {
        "type": "message",
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Summarize the above message in one sentence."
          }
        ]
      }
    ]
  }
}
```

<a id="response.cancel"></a>

## response.cancel

发送此事件以取消正在进行的响应。服务端将返回
一个 `response.done` 状态为 `response.status=cancelled`。的事件。如果没有可取消的响应，服务端将返回错误。此操作
是安全的
用于调用 `response.cancel` 即使没有正在进行的响应，也会产生错误
返回的会话将保持不变。

### Schema

Schema name: `RealtimeClientEventResponseCancel`

- `type: "response.cancel"`

  事件类型，必须为 `response.cancel`.

  - `"response.cancel"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

- `response_id: optional string`

  用于取消的特定响应 ID - 如果未提供，将取消
  默认会话中正在进行的响应。

### 示例

```json
{
    "type": "response.cancel",
    "response_id": "resp_12345"
}
```

<a id="output_audio_buffer.clear"></a>

## output_audio_buffer.clear

**仅限 WebRTC/SIP:** 触发以切断当前的音频响应。这将让服务端
停止生成音频并发出 `output_audio_buffer.cleared` 事件。该
事件应通过一个 `response.cancel` 客户端事件来停止当前响应的
生成。
[了解更多](https://developers.openai.com/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

### Schema

Schema name: `RealtimeClientEventOutputAudioBufferClear`

- `type: "output_audio_buffer.clear"`

  事件类型，必须为 `output_audio_buffer.clear`.

  - `"output_audio_buffer.clear"`

- `event_id: optional string`

  用于错误处理的客户端事件的唯一 ID。

### 示例

```json
{
    "event_id": "optional_client_event_id",
    "type": "output_audio_buffer.clear"
}
```
