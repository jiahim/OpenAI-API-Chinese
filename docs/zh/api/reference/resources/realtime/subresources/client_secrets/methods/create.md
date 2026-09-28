> 如需查看完整文档索引,请参阅 [llms.txt](/llms.txt).可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## Create client secret

**post** `/realtime/client_secrets`

创建一个 Realtime 客户端密钥，并附带会话配置。

客户端密钥是短时令牌，可以传递给客户端应用，
例如网页前端或移动客户端，使其无需
泄露你的主 API 密钥即可访问 Realtime API。你可以为每个客户端密钥配置自定义 TTL。

你还可以将会话配置选项附加到客户端密钥，
这些选项将应用于使用该客户端密钥创建的所有会话，
但也可被客户端连接覆盖。

[了解有关通过 WebRTC 使用客户端密钥进行身份验证的更多信息](/api/docs/guides/realtime-webrtc).

返回创建的客户端密钥以及有效的会话对象。客户端密钥是一个形如以下形式的字符串 `ek_1234`.

### 正文参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期的配置。过期指的是此时间之后
  客户端密钥将不再可用于创建会话。该会话本身可以在
  该时间之后继续进行，即使已经开始。一个密钥可以用于创建多个会话
  直到它过期。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，意味着 `seconds` 将被添加到客户端密钥的 `created_at` 时间上以生成过期时间戳。目前仅支持 `created_at` 。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择一个介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于该客户端密钥的会话配置。选择 realtime
  会话或 transcription 会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。始终为 `realtime` （针对 Realtime API）。

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

          用于输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本或会议室麦克风等远场麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          用于输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的引导，而非模型实际听到的精确内容。客户端可以选择性地设置转写所用的语言和提示词，这些为转写服务提供了额外的引导。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在发出转写文本之前等待的时间。
            较高的值可以提高转写准确率，但会增加延迟。
            仅支持 `gpt-realtime-whisper` 的 GA Realtime 会话。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转写的词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`) 格式
            将提高准确率并降低延迟。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。使用 `gpt-4o-transcribe-diarize` 可在需要带说话人标签的说话人分离时使用。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。使用 `gpt-4o-transcribe-diarize` 可在需要带说话人标签的说话人分离时使用。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            可选的文本，用于引导模型的风格或延续先前的音频
            片段。
            对于 `whisper-1`，该 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是自由文本字符串，例如 "expect words related to technology"。
            Prompt 不支持用于 `gpt-realtime-whisper` 的 GA Realtime 会话。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型会根据音频音量检测语音的开始和结束，并在用户语音结束时作出回应。

          Semantic VAD 更为先进，它会使用一个轮次检测模型（与 VAD 结合使用），从语义层面估计用户是否已说完，然后根据该概率动态设置一个超时时间。例如，如果用户的语音以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续发言。这种方式有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 可开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经在响应时可能会无法创建响应。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过后将自动触发模型响应。这在
              用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将基于当前
              上下文有效地提示用户继续对话。
              基于当前上下文。

              该超时值将在上一次模型响应的音频播放完毕后生效，
              即它被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              将在达到超时时被发出。
              空闲超时目前仅在 `server_vad` 模式下受支持。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）任何正在进行的向默认
              会话（即。 `conversation` 的 `auto`）输出）响应。如果 `true` 则为 true，则响应将被取消，否则将一直继续直到完成。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频时长（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静音持续时长（以毫秒为单位）。默认为
              500ms。使用较小的值时，模型会更快地做出响应，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              较高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时说完。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间地等待用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              在 VAD 开始事件发生时，是否自动中断任何正在进行的响应并向默认
              会话（即。 `conversation` 的 `auto`) 输出。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应的速度，相对于原始速度的倍数。
          1.0 是默认速度，0.25 是最低速度，1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中更改。

          该参数是对生成后音频的后处理调整，也可以
          通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回应的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供一个自定义 voice 对象，其中包含
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法更改
          在会话期间，一旦模型至少响应过一次音频即可。
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

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置在模型调用前的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极度简洁”、“表现得友好”、“以下是优秀响应的示例”），以及在音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常笑”）。这些指令不一定被模型严格遵循，但会为模型提供期望行为的指引。

      注意，服务端会设置默认指令，如果未设置此字段，将使用这些默认指令，这些默认指令在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的
      最大 token 数。默认为 `inf`.

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

      模型可以响应的模态集合。默认为 `["audio"]`，表示
      模型将同时以音频和转录文本进行响应。 `["text"]` 可用于发起
      模型仅返回文本。两者无法同时请求 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅
      reasoning Realtime 模型支持 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        要在你的
        提示中替换的变量值的可选映射。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型，始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送到模型的文件 ID。

          - `image_url: optional string or null`

            要发送到模型的图片 URL。可以是完整的 URL，也可以是 base64 编码的图片 data URL。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送到模型的文件输入。

          - `type: "input_file"`

            输入项的类型，始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送到模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 消耗。使用 `low` 可降低渲染成本，或者使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送到模型的文件内容。

          - `file_id: optional string or null`

            要发送到模型的文件 ID。

          - `file_url: optional string`

            要发送到模型的文件 URL。

          - `filename: optional string`

            要发送到模型的文件名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      针对具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        针对具备推理能力的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型选择工具的方式。可提供字符串模式之一，或强制使用指定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有的话）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        更多工具。

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

        使用此选项强制模型在远程 MCP 服务器上调用特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具的名称。

    - `tools: optional RealtimeToolsConfig`

      可供模型使用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何
          调用它的指引，以及调用时向用户说明什么的
          （指引（如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器
        （为模型提供额外的工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

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

          允许的工具名称列表或筛选对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是修改数据还是只读。如果某个
              MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              标注，则会匹配此筛选器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可配合
          自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器的信息 [请参见此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对于 2026 年 9 月 1 日之后发布的模型已弃用。
          使用 `server_url` 连接远程 MCP 服务器，或 `tunnel_id` 通过
          安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的取值有：

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

          发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`,或与工具关联的过滤对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是修改数据还是只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                标注，则会匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是修改数据还是只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                标注，则会匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的 Secure MCP Tunnel ID。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 以禁用追踪。一旦为某个会话启用了
      追踪，便无法再修改配置。

      `auto` 会使用默认值（包括工作流名称、组 ID 和元数据）创建一个会话追踪。
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对追踪的细粒度配置。

        - `group_id: optional string`

          要附加到此追踪的组 ID，以便在追踪仪表板中进行过滤和
          分组。

        - `metadata: optional unknown`

          要附加到此追踪的任意元数据，以便在追踪仪表板中进行
          过滤。

        - `workflow_name: optional string`

          要附加到此工作流的追踪的名称。该名称用于
          在 Traces Dashboard 中命名此追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，即最早的消息不会包含在模型的上下文内。上下文为 32k、最大输出 token 为 4,096 的模型在发生截断之前，上文中只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方法。

      截断会减少下一轮中被缓存的 token 数（使缓存失效），因为消息会从上下文的开头被丢弃。但是，客户端也可以将截断配置为保留最多占最大上下文一定比例的消息，从而减少后续截断的需要，并提升缓存命中率。

      可以完全禁用截断，这意味着服务端永远不会进行截断，但如果对话超过模型的输入 token 上限，则会返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留对话 token 的一部分。这样可以在多轮之间分摊截断开销，有助于改善缓存 token 的使用。

        - `retention_ratio: number`

          超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超过输入 token 上限时， `0.8` 表示会丢弃消息，直到剩余的 token 用量降至允许上限的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，则使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令（即包括工具定义）之后对话中允许的最大 token 数。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 个 token 时就会发生截断。此值不能高于模型的上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          用于输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本或会议室麦克风等远场麦克风。

        - `transcription: optional AudioTranscription`

          用于输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的引导，而非模型实际听到的精确内容。客户端可以选择性地设置转写所用的语言和提示词，这些为转写服务提供了额外的引导。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型会根据音频音量检测语音的开始和结束，并在用户语音结束时作出回应。

          Semantic VAD 更为先进，它会使用一个轮次检测模型（与 VAD 结合使用），从语义层面估计用户是否已说完，然后根据该概率动态设置一个超时时间。例如，如果用户的语音以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续发言。这种方式有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 可开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经在响应时可能会无法创建响应。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过后将自动触发模型响应。这在
              用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将基于当前
              上下文有效地提示用户继续对话。
              基于当前上下文。

              该超时值将在上一次模型响应的音频播放完毕后生效，
              即它被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              将在达到超时时被发出。
              空闲超时目前仅在 `server_vad` 模式下受支持。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）任何正在进行的向默认
              会话（即。 `conversation` 的 `auto`）输出）响应。如果 `true` 则为 true，则响应将被取消，否则将一直继续直到完成。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频时长（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静音持续时长（以毫秒为单位）。默认为
              500ms。使用较小的值时，模型会更快地做出响应，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              较高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时说完。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间地等待用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              在 VAD 开始事件发生时，是否自动中断任何正在进行的响应并向默认
              会话（即。 `conversation` 的 `auto`) 输出。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### 返回值

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元以来的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  用于实时会话或转录会话的会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    实时会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型，始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。始终为 `realtime` （针对 Realtime API）。

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

          用于输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本或会议室麦克风等远场麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }  or null`

          用于输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的引导，而非模型实际听到的精确内容。客户端可以选择性地设置转写所用的语言和提示词，这些为转写服务提供了额外的引导。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示（如果存在）。

        - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测的配置，可为 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型会根据音频音量检测语音的开始和结束，并在用户语音结束时作出回应。

          Semantic VAD 更为先进，它会使用一个轮次检测模型（与 VAD 结合使用），从语义层面估计用户是否已说完，然后根据该概率动态设置一个超时时间。例如，如果用户的语音以 "uhhm" 结尾，模型会给出较低的轮次结束概率，并等待更长时间以让用户继续发言。这种方式有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 可开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经在响应时可能会无法创建响应。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过后将自动触发模型响应。这在
              用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将基于当前
              上下文有效地提示用户继续对话。
              基于当前上下文。

              该超时值将在上一次模型响应的音频播放完毕后生效，
              即它被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              将在达到超时时被发出。
              空闲超时目前仅在 `server_vad` 模式下受支持。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）任何正在进行的向默认
              会话（即。 `conversation` 的 `auto`）输出）响应。如果 `true` 则为 true，则响应将被取消，否则将一直继续直到完成。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频时长（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静音持续时长（以毫秒为单位）。默认为
              500ms。使用较小的值时，模型会更快地做出响应，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              较高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时说完。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间地等待用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              在 VAD 开始事件发生时，是否自动中断任何正在进行的响应并向默认
              会话（即。 `conversation` 的 `auto`) 输出。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应的速度，相对于原始速度的倍数。
          1.0 是默认速度，0.25 是最低速度，1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中更改。

          该参数是对生成后音频的后处理调整，也可以
          通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的声音。一旦模型已经至少回应过一次音频，会话期间就无法再更改声音。当前
          可用的声音选项包括
          。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。以获得 `marin` 和 `cedar` 最佳
          质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的声音。一旦模型已经至少回应过一次音频，会话期间就无法再更改声音。当前
            可用的声音选项包括
            。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。以获得 `marin` 和 `cedar` 最佳
            质量。

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

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置在模型调用前的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极度简洁”、“表现得友好”、“以下是优秀响应的示例”），以及在音频行为上的表现（例如“语速快一些”、“在声音中加入情感”、“经常笑”）。这些指令不一定被模型严格遵循，但会为模型提供期望行为的指引。

      注意，服务端会设置默认指令，如果未设置此字段，将使用这些默认指令，这些默认指令在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的
      最大 token 数。默认为 `inf`.

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

      模型可以响应的模态集合。默认为 `["audio"]`，表示
      模型将同时以音频和转录文本进行响应。 `["text"]` 可用于发起
      模型仅返回文本。两者无法同时请求 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        要在你的
        提示中替换的变量值的可选映射。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型，始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送到模型的文件 ID。

          - `image_url: optional string or null`

            要发送到模型的图片 URL。可以是完整的 URL，也可以是 base64 编码的图片 data URL。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送到模型的文件输入。

          - `type: "input_file"`

            输入项的类型，始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送到模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 消耗。使用 `low` 可降低渲染成本，或者使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送到模型的文件内容。

          - `file_id: optional string or null`

            要发送到模型的文件 ID。

          - `file_url: optional string`

            要发送到模型的文件 URL。

          - `filename: optional string`

            要发送到模型的文件名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      针对具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        针对具备推理能力的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。可提供字符串模式之一，或强制使用指定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有的话）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        更多工具。

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

        使用此选项强制模型在远程 MCP 服务器上调用特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具的名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      可供模型使用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何
          调用它的指引，以及调用时向用户说明什么的
          （指引（如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器
        （为模型提供额外的工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

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

          允许的工具名称列表或筛选对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是修改数据还是只读。如果某个
              MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              标注，则会匹配此筛选器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可配合
          自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器的信息 [请参见此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对于 2026 年 9 月 1 日之后发布的模型已弃用。
          使用 `server_url` 连接远程 MCP 服务器，或 `tunnel_id` 通过
          安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的取值有：

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

          发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`,或与工具关联的过滤对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是修改数据还是只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                标注，则会匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是修改数据还是只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                标注，则会匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的 Secure MCP Tunnel ID。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 以禁用追踪。一旦为某个会话启用了
      追踪，便无法再修改配置。

      `auto` 会使用默认值（包括工作流名称、组 ID 和元数据）创建一个会话追踪。
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对追踪的细粒度配置。

        - `group_id: optional string`

          要附加到此追踪的组 ID，以便在追踪仪表板中进行过滤和
          分组。

        - `metadata: optional unknown`

          要附加到此追踪的任意元数据，以便在追踪仪表板中进行
          过滤。

        - `workflow_name: optional string`

          要附加到此工作流的追踪的名称。该名称用于
          在 Traces Dashboard 中命名此追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，即最早的消息不会包含在模型的上下文内。上下文为 32k、最大输出 token 为 4,096 的模型在发生截断之前，上文中只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方法。

      截断会减少下一轮中被缓存的 token 数（使缓存失效），因为消息会从上下文的开头被丢弃。但是，客户端也可以将截断配置为保留最多占最大上下文一定比例的消息，从而减少后续截断的需要，并提升缓存命中率。

      可以完全禁用截断，这意味着服务端永远不会进行截断，但如果对话超过模型的输入 token 上限，则会返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留对话 token 的一部分。这样可以在多轮之间分摊截断开销，有助于改善缓存 token 的使用。

        - `retention_ratio: number`

          超过输入 token 上限时需保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超过输入 token 上限时， `0.8` 表示会丢弃消息，直到剩余的 token 用量降至允许上限的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，则使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令（即包括工具定义）之后对话中允许的最大 token 数。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 个 token 时就会发生截断。此值不能高于模型的上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    实时转录会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: string`

      对象类型，始终为 `realtime.transcription_session`.

    - `type: "transcription"`

      会话类型，始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional object { input }`

      会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪的配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本或会议室麦克风等远场麦克风。

        - `transcription: optional object { language, languages, model, prompt }  or null`

          转录模型的配置。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示（如果存在）。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测的配置。可设置为 `null` 以关闭。服务端
          VAD 意味着模型将根据
          音频音量检测语音的开始和结束，并在用户语音结束时做出响应。对于 `gpt-realtime-whisper`,这必须是 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到的语音之前要包含的音频量(单位:
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静音持续时间(以毫秒为单位)。默认值
            500ms。使用较小的值时，模型会更快地做出响应，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值(0.0 到 1.0),默认值为 0.5。一个
            较高的阈值需要更响亮的音频才能激活模型，因此
            在嘈杂环境中可能会有更好的表现。

          - `type: optional string`

            轮次检测的类型,仅 `server_vad` 。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      要在服务端输出中包含的额外字段。

      - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

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
