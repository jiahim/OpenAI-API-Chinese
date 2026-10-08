> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

## 创建客户端密钥

**post** `/realtime/client_secrets`

创建一个 Realtime 客户端密钥，并附带会话配置。

客户端密钥是短期有效的令牌，可以传递给客户端应用，例如，
Web 前端或移动客户端，用于在访问 Realtime API 时无需
泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义 TTL。

你也可以将会话配置选项附加到客户端密钥上，这些配置将
应用于使用该客户端密钥创建的所有会话，但这些配置也可以被
客户端连接覆盖。

[了解更多关于通过 WebRTC 使用客户端密钥进行身份验证的信息](/api/docs/guides/realtime-webrtc).

返回已创建的客户端密钥以及生效的会话对象。客户端密钥是一个字符串，形如 `ek_1234`.

### Body Parameters

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期指的是此时间之后
  客户端密钥将不再可用于创建会话。会话本身在启动后
  仍可在此时间之后继续运行。一个密钥在过期之前可用于创建多个
  会话。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点， `seconds` 将添加到客户端密钥的 `created_at` 时间以生成过期时间戳。当前仅支持 `created_at` 。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选取介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，则默认为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。可选择实时
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    实时会话对象配置。

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

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送至 VAD 和模型之前，对添加到输入音频缓冲区的音频进行滤波。
          音频滤波可以提高 VAD 和轮次检测的准确性（减少误检），并通过改善模型对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接处理音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型精确听到的内容。客户端可以选择为转录设置语言和提示词，这些会为转录服务提供额外指导。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转录文本前等待的时间。
            较高的值可以提高转录准确性，但会增加延迟。
            仅支持与 `gpt-realtime-whisper` 配合用于正式发布的 Realtime 会话。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于指导输入音频转录的词语或短语。获得以下支持： `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            将提高准确性和降低延迟。

          - `languages: optional array of string`

            输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。使用 `gpt-4o-transcribe-diarize` （当需要带说话者标签的说话人分离时）。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。使用 `gpt-4o-transcribe-diarize` （当需要带说话者标签的说话人分离时）。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            可选文本，用于引导模型风格或延续先前的音频
            片段。
            对于 `whisper-1`，该 [提示词是关键词列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与技术相关的词语”。
            不支持提示词，使用 `gpt-realtime-whisper` 配合用于正式发布的 Realtime 会话。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭轮次检测，此时客户端必须手动触发模型响应。

          Server VAD 表示模型会根据音频音量检测语音的开始和结束，并在用户说完后作出响应。

          语义 VAD 更高级，它使用轮次检测模型（与 VAD 结合），从语义层面估算用户是否已说完，然后根据该概率动态设置超时时间。例如，如果用户音频以“uhhm”结尾，模型会将轮次结束概率评为较低，并等待更长时间，以便用户继续说话。这有助于实现更自然的对话，但可能会增加延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），检测到用户语音时开启，在一段时间的静默后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已在响应时，可能会因此无法创建响应。

              如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永不自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到期后将自动触发模型响应。这在
              用户长时间暂停出乎意料的情况下很有用，例如电话
              通话。模型实际上会根据当前上下文提示用户继续对话，
              。

              超时值将在最后一次模型响应的音频播放完毕后开始计算，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`）中任何正在进行的有输出响应。如果 `true` 则响应将被取消，否则将一直继续直到完成。

              如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永不自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频时长（单位
              毫秒），默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止所需的静默时长（毫秒），默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置
              更高的阈值需要更大的声音才能激活模型，因此
              在嘈杂环境中可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 为默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 起始事件发生时，是否使用输出自动中断任何正在进行的响应到默认
              会话（即。 `conversation` 的 `auto`) 当 VAD 起始事件发生时。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型口头响应速度，作为原始速度的倍数。
          1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

          该参数是对生成后音频的后处理调整，
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

          模型用于响应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，使用
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法更改
          在会话期间，模型至少响应过一次音频后。
          自定义语音必须基于音频样本创建。
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

              自定义语音 ID，例如： `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端指导模型生成所需的响应。可指示模型响应的内容和格式（例如“务必简洁”“表现友好”“以下是优秀响应的示例”），以及音频行为（例如“快速说话”“在语音中注入情绪”“经常笑”）。模型不一定会遵循这些指令，但这些指令可为模型提供所需行为的指导。

      请注意，服务端会设置默认指令；如果未设置此字段，将使用这些指令，并且这些指令在 `session.created` 会话开始时的 event 中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应中输出 token 的最大数量，
      其中包含工具调用。提供一个 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 指定模型的可用最大 token 数。默认为
      给定模型。默认值为 `inf`.

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

      模型可响应的模态集合。默认为 `["audio"]`，表示
      模型将使用音频和转录文本进行响应。 `["text"]` 可用于使
      模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅支持
      推理类 Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于在你的
        提示中替换变量的可选映射值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

            要发送给模型的图片的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图片。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的输入文件。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送给模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可降低渲染成本，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        对支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型选择工具的方式。可提供以下字符串模式之一，或强制使用特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间选择。

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
          调用它的指导，以及在调用时告诉用户什么
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          JSON Schema 中的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        （MCP）服务器为模型提供额外的工具。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          该 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          该工具的调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是只读的。如果某个
              MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              标记，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，既可以
          配合自定义 MCP 服务器 URL 使用，也可以配合服务连接器使用。你的应用
          必须处理 OAuth 授权流程，并在此处提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供其中之一。详细了解
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。详细了解
          服务连接器的相关信息 [here](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          请使用 `server_url` 以连接到远程 MCP 服务器，或 `tunnel_id` 通过
          安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的取值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google Calendar： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
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

          此 MCP 工具是否被延迟，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤器对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是只读的。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                标记，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是只读的。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                标记，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定一个统一的审批策略。可选值为 `always` 或
            `never`。之一。设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。需提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为某个会话启用了
      追踪，就无法再修改该配置。

      `auto` 会使用默认的追踪名称、group id 和 metadata 为该会话创建一个追踪。
      工作流名称、group id 和 metadata。

      - `Auto = "auto"`

        启用追踪并为追踪配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪的 group id，用于在 Traces Dashboard 中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪的任意 metadata，用于启用
          在追踪面板中进行筛选。

        - `workflow_name: optional string`

          要附加到此工作流的追踪的名称。这用于
          在追踪面板中为该追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着最早的消息不会包含在模型的上下文中。一个具有 4,096 最大输出 token 的 32k 上下文模型，在发生截断之前只能在其上下文中包含 28,224 个 token。

      客户端可以配置截断行为，以更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方式。

      截断会减少下一轮中的已缓存 token 数量（破坏缓存），因为消息会从上下文开头被丢弃。然而，客户端也可以将截断配置为保留最多达到最大上下文一定比例的消息，从而减少未来截断的需要，进而提升缓存命中率。

      截断可以完全禁用，这意味着服务端永远不会进行截断，而是在对话超过模型的输入 token 上限时报错。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留对话 token 的一部分。这允许你在多轮之间分摊截断，有助于提升已缓存 token 的使用率。

        - `retention_ratio: number`

          当对话超过输入 token 上限时，保留指令后对话 token 的比例（`0.0` - `1.0`）。将其设置为 `0.8` 意味着将丢弃消息，直到使用率达到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 表示当指令后的对话超过 5,000 个 token 时将进行截断。该值不能高于模型的上下文窗口大小减去最大输出 token。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。对于 Realtime API，始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送至 VAD 和模型之前，对添加到输入音频缓冲区的音频进行滤波。
          音频滤波可以提高 VAD 和轮次检测的准确性（减少误检），并通过改善模型对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接处理音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型精确听到的内容。客户端可以选择为转录设置语言和提示词，这些会为转录服务提供额外指导。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭轮次检测，此时客户端必须手动触发模型响应。

          Server VAD 表示模型会根据音频音量检测语音的开始和结束，并在用户说完后作出响应。

          语义 VAD 更高级，它使用轮次检测模型（与 VAD 结合），从语义层面估算用户是否已说完，然后根据该概率动态设置超时时间。例如，如果用户音频以“uhhm”结尾，模型会将轮次结束概率评为较低，并等待更长时间，以便用户继续说话。这有助于实现更自然的对话，但可能会增加延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），检测到用户语音时开启，在一段时间的静默后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已在响应时，可能会因此无法创建响应。

              如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永不自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到期后将自动触发模型响应。这在
              用户长时间暂停出乎意料的情况下很有用，例如电话
              通话。模型实际上会根据当前上下文提示用户继续对话，
              。

              超时值将在最后一次模型响应的音频播放完毕后开始计算，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`）中任何正在进行的有输出响应。如果 `true` 则响应将被取消，否则将一直继续直到完成。

              如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永不自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频时长（单位
              毫秒），默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止所需的静默时长（毫秒），默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置
              更高的阈值需要更大的声音才能激活模型，因此
              在嘈杂环境中可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 为默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 起始事件发生时，是否使用输出自动中断任何正在进行的响应到默认
              会话（即。 `conversation` 的 `auto`) 当 VAD 起始事件发生时。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### 返回值

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元起的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  实时会话或转录会话的会话配置。

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

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送至 VAD 和模型之前，对添加到输入音频缓冲区的音频进行滤波。
          音频滤波可以提高 VAD 和轮次检测的准确性（减少误检），并通过改善模型对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }  or null`

          输入音频转录配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接处理音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型精确听到的内容。客户端可以选择为转录设置语言和提示词，这些会为转录服务提供额外指导。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

            为输入音频转录配置的提示词（若存在）。

        - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭轮次检测，此时客户端必须手动触发模型响应。

          Server VAD 表示模型会根据音频音量检测语音的开始和结束，并在用户说完后作出响应。

          语义 VAD 更高级，它使用轮次检测模型（与 VAD 结合），从语义层面估算用户是否已说完，然后根据该概率动态设置超时时间。例如，如果用户音频以“uhhm”结尾，模型会将轮次结束概率评为较低，并等待更长时间，以便用户继续说话。这有助于实现更自然的对话，但可能会增加延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），检测到用户语音时开启，在一段时间的静默后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已在响应时，可能会因此无法创建响应。

              如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永不自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到期后将自动触发模型响应。这在
              用户长时间暂停出乎意料的情况下很有用，例如电话
              通话。模型实际上会根据当前上下文提示用户继续对话，
              。

              超时值将在最后一次模型响应的音频播放完毕后开始计算，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              将在达到超时时间时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`）中任何正在进行的有输出响应。如果 `true` 则响应将被取消，否则将一直继续直到完成。

              如果两者都 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永不自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频时长（单位
              毫秒），默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止所需的静默时长（毫秒），默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置
              更高的阈值需要更大的声音才能激活模型，因此
              在嘈杂环境中可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地响应。 `auto` 为默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 起始事件发生时，是否使用输出自动中断任何正在进行的响应到默认
              会话（即。 `conversation` 的 `auto`) 当 VAD 起始事件发生时。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型口头响应速度，作为原始速度的倍数。
          1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

          该参数是对生成后音频的后处理调整，
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的语音。一旦模型至少以音频回应过一次，在该
          会话期间语音便无法更改。当前
          可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少以音频回应过一次，在该
            会话期间语音便无法更改。当前
            可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端指导模型生成所需的响应。可指示模型响应的内容和格式（例如“务必简洁”“表现友好”“以下是优秀响应的示例”），以及音频行为（例如“快速说话”“在语音中注入情绪”“经常笑”）。模型不一定会遵循这些指令，但这些指令可为模型提供所需行为的指导。

      请注意，服务端会设置默认指令；如果未设置此字段，将使用这些指令，并且这些指令在 `session.created` 会话开始时的 event 中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应中输出 token 的最大数量，
      其中包含工具调用。提供一个 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 指定模型的可用最大 token 数。默认为
      给定模型。默认值为 `inf`.

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

      模型可响应的模态集合。默认为 `["audio"]`，表示
      模型将使用音频和转录文本进行响应。 `["text"]` 可用于使
      模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于在你的
        提示中替换变量的可选映射值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

            要发送给模型的图片的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图片。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的输入文件。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送给模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可降低渲染成本，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        对支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。可提供以下字符串模式之一，或强制使用特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间选择。

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

    - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何
          调用它的指导，以及在调用时告诉用户什么
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          JSON Schema 中的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        （MCP）服务器为模型提供额外的工具。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          该 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          该工具的调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是只读的。如果某个
              MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              标记，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，既可以
          配合自定义 MCP 服务器 URL 使用，也可以配合服务连接器使用。你的应用
          必须处理 OAuth 授权流程，并在此处提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供其中之一。详细了解
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。详细了解
          服务连接器的相关信息 [here](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          请使用 `server_url` 以连接到远程 MCP 服务器，或 `tunnel_id` 通过
          安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的取值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google Calendar： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
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

          此 MCP 工具是否被延迟，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤器对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是只读的。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                标记，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是只读的。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                标记，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定一个统一的审批策略。可选值为 `always` 或
            `never`。之一。设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。需提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为某个会话启用了
      追踪，就无法再修改该配置。

      `auto` 会使用默认的追踪名称、group id 和 metadata 为该会话创建一个追踪。
      工作流名称、group id 和 metadata。

      - `Auto = "auto"`

        启用追踪并为追踪配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪的 group id，用于在 Traces Dashboard 中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪的任意 metadata，用于启用
          在追踪面板中进行筛选。

        - `workflow_name: optional string`

          要附加到此工作流的追踪的名称。这用于
          在追踪面板中为该追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着最早的消息不会包含在模型的上下文中。一个具有 4,096 最大输出 token 的 32k 上下文模型，在发生截断之前只能在其上下文中包含 28,224 个 token。

      客户端可以配置截断行为，以更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方式。

      截断会减少下一轮中的已缓存 token 数量（破坏缓存），因为消息会从上下文开头被丢弃。然而，客户端也可以将截断配置为保留最多达到最大上下文一定比例的消息，从而减少未来截断的需要，进而提升缓存命中率。

      截断可以完全禁用，这意味着服务端永远不会进行截断，而是在对话超过模型的输入 token 上限时报错。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留对话 token 的一部分。这允许你在多轮之间分摊截断，有助于提升已缓存 token 的使用率。

        - `retention_ratio: number`

          当对话超过输入 token 上限时，保留指令后对话 token 的比例（`0.0` - `1.0`）。将其设置为 `0.8` 意味着将丢弃消息，直到使用率达到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 表示当指令后的对话超过 5,000 个 token 时将进行截断。该值不能高于模型的上下文窗口大小减去最大输出 token。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    Realtime 转录会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: string`

      对象类型。始终为 `realtime.transcription_session`.

    - `type: "transcription"`

      会话类型。始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional object { input }`

      该会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

        - `transcription: optional object { language, languages, model, prompt }  or null`

          转录模型配置。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

            为输入音频转录配置的提示词（若存在）。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测配置。可设置为 `null` 将其关闭。服务端
          VAD 表示模型将根据以下因素检测语音的开始和结束：
          音量，并在用户说完后作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到语音之前包含的音频量（以
            毫秒），默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静音时长（以毫秒为单位）。默认为
            为 500ms。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
            更高的阈值需要更大的声音才能激活模型，因此
            在嘈杂环境中可能会有更好的表现。

          - `type: optional string`

            轮次检测类型，仅限 `server_vad` 。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      要在服务端输出中包含的附加字段。

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
