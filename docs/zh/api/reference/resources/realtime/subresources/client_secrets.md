# 客户端密钥

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## 创建客户端密钥

**post** `/realtime/client_secrets`

创建一个 Realtime 客户端密钥，并附带会话配置。

客户端密钥是短时效的令牌，可以传递给客户端应用，
例如 Web 前端或移动客户端，用于访问 Realtime API，而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义 TTL。
leaking your main 接口 key. You can configure a custom TTL for each client secret.

你还可以将会话配置选项附加到客户端密钥上，这些选项将
应用于使用该客户端密钥创建的所有会话，但客户端连接也可以覆盖这些选项。
客户端连接时设置的选项可能覆盖上述配置。

[了解有关通过 WebRTC 使用客户端密钥进行身份验证的更多信息](/api/docs/guides/realtime-webrtc).

返回已创建的客户端密钥以及生效的会话对象。客户端密钥是一个字符串，格式类似于 `ek_1234`.

### Body Parameters

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期是指在此之后
  客户端密钥将不再可用于创建会话。一旦开始，会话本身可以
  在该时间之后继续。一个密钥可用于创建多个会话
  直到过期。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，即 `seconds` 将被添加到 `created_at` 客户端密钥的时间以生成过期时间戳。仅支持 `created_at` 目前可用。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择介于 `10` 和 `7200` (2 小时) 之间的值。如果未指定，默认值为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择实时
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    实时会话对象配置。

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
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，从而提升 VAD 和轮次检测的准确性（减少误报），并提高模型表现。

          - `type: optional NoiseReductionType`

            降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可以设置为 `null` 以在开启后关闭。输入音频转录并非模型原生支持，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，因此应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，它们为转录服务提供了额外的指引。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转录文本前等待的时间。
            较高的值可以提高转录准确性，但会增加延迟。
            仅在以下情况中支持： `gpt-realtime-whisper` 在正式版 Realtime 会话中。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转录的单词或短语。支持以下模型： `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在中提供输入语言
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            将提高准确性和降低延迟。

          - `languages: optional array of string`

            输入音频的可能语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。获得支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。使用 `gpt-4o-transcribe-diarize` （当需要带说话人标签的说话人分离时）。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。使用 `gpt-4o-transcribe-diarize` （当需要带说话人标签的说话人分离时）。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            可选文本，用于引导模型的风格或延续上一段音频
            片段。
            对于 `whisper-1`，该 [提示词是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示词是自由文本字符串，例如“期望与技术相关的词语”。
            不支持提示词 `gpt-realtime-whisper` 在正式版 Realtime 会话中。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭轮次检测，在这种情况下，客户端必须手动触发模型响应。

          Server VAD 意味着模型会根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

          Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义层面地判断用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以 "uhhm" 结尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，turn detection 必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              turn detection 的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，由于模型可能已在响应中，可能会导致创建响应失败。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到时将自动触发模型响应。该参数
              适用于用户长时间停顿出乎意料的场景，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              基于当前上下文。

              超时值将在上一个模型响应的音频播放完毕后开始计算，
              即它设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              ）将在达到超时阈值时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）任何正在进行的、向默认
              对话（即。 `conversation` 的 `auto`）输出的响应。若为 `true` ，则该响应将被取消；否则它将继续执行直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位为
              毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止所需的静默时长（单位为毫秒）。默认为
              500ms。使用更小的值时，模型会更快地响应，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更
              高的阈值需要更大的音频音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型判断用户何时结束说话。

            - `type: "semantic_vad"`

              turn detection 的类型， `semantic_vad` 启用语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会更久地等待用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最长超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否通过输出自动中断任何正在进行的响应
              对话（即。 `conversation` 的 `auto`）当 VAD 开始事件发生时。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应相对于原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行期间更改。

          此参数是对音频生成后的后处理调整，
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

          模型用于响应的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供包含以下内容的自定义声音对象：
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法更改
          在会话中，一旦模型至少响应过一次音频后即可使用。
          自定义声音必须由音频样本创建。
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

            自定义声音引用。

            - `id: string`

              自定义声音 ID，例如 `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      服务端输出中要包含的附加字段。

      `item.input_audio_transcription.logprobs`:为输入音频转写包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型输出期望的回复。可以指示模型回复的内容和格式（例如“极其简洁”、“表现得友好一些”、“以下是优质回复的示例”），以及音频行为（例如“说话要快”、“在声音中注入情绪”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型期望的行为提供了指导。

      请注意，服务端会设置默认指令，如果此字段未设置，则会使用这些默认指令，并在 `session.created` 事件中可见，该事件位于会话开始时。

    - `max_output_tokens: optional number or "inf"`

      单次助手回复的最大输出 token 数，
      包含工具调用。提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或者 `inf` 以使用给定模型支持的最大可用 token 数。默认为
      给定模型的 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的实时模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的实时模型。

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
      模型将同时以音频和转写文本进行响应。 `["text"]` 可用于让
      模型仅以文本形式回复。不能同时请求两者 `text` 和 `audio` 。

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

        可选的变量替换映射，用于在
        提示中替换变量值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像细节级别。其一为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送到模型的文件的 ID。

          - `image_url: optional string or null`

            要发送到模型的图片的 URL。可以是完整的 URL，也可以是 base64 编码的图片 data URL。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的输入文件。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得较低成本的渲染，或使用 `high` 以更高的质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送到模型的文件内容。

          - `file_id: optional string or null`

            要发送到模型的文件的 ID。

          - `file_url: optional string`

            要发送到模型的文件的 URL。

          - `filename: optional string`

            要发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        可选的提示模板版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        支持推理的 Realtime 模型（如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型选择工具的方式。可以传入字符串模式之一，或强制使用特定的
      函数 / MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 意味着模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
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

          函数的描述，包括关于何时以及如何
          调用它的指引，以及关于调用时该告诉用户什么
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议
        （MCP）服务器为模型提供更多工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用的上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

          允许的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与
          自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程，并在此处提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。详细了解
          服务连接器 [请参考此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          请使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 通过
          Secure MCP Tunnel 连接。

          当前支持的 `connector_id` 值包括：

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

          此 MCP 工具是否延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。可用于身份验证
          或其他用途。

        - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要批准。可以是
            `always`, `never`，或与需要批准的工具关联的过滤对象
            需要批准的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。之一。设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文信息。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于代替直连服务器 URL 的 Secure MCP Tunnel ID。需提供以下
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [追踪面板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦为某个会话启用
      追踪，配置便不可再修改。

      `auto` 会为该会话创建一个 追踪，并使用默认值填充
      工作流 名称、group id 和 metadata。

      - `Auto = "auto"`

        启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 上的 group id，用于在追踪面板中过滤和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 上的任意元数据，用于启用
          在 Traces Dashboard 中进行筛选。

        - `workflow_name: optional string`

          要附加到此工作流的追踪名称。这用于
          在 Traces Dashboard 中为追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着最早的消息不会包含在模型的上下文之中。对于 32k 上下文且最大输出 token 为 4,096 的模型，在发生截断之前，上文中最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方式。

      截断会减少下一轮中缓存的 token 数量（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文一定比例的消息，从而减少未来截断的需要并提升缓存命中率。

      可以完全禁用截断，这意味着服务器永远不会截断，而是会在对话超过模型的输入 token 上限时返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多个轮次中，有助于提高缓存 token 的使用率。

        - `retention_ratio: number`

          当对话超过输入 token 上限时保留的指令后对话 token 比例（`0.0` - `1.0`)。将其设置为 `0.8` 意味着会丢弃消息，直到使用的 token 达到最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 个 token 时会发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

          输入音频降噪的配置。可以设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，从而提升 VAD 和轮次检测的准确性（减少误报），并提高模型表现。

          - `type: optional NoiseReductionType`

            降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可以设置为 `null` 以在开启后关闭。输入音频转录并非模型原生支持，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，因此应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，它们为转录服务提供了额外的指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭轮次检测，在这种情况下，客户端必须手动触发模型响应。

          Server VAD 意味着模型会根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

          Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义层面地判断用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以 "uhhm" 结尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，turn detection 必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              turn detection 的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，由于模型可能已在响应中，可能会导致创建响应失败。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到时将自动触发模型响应。该参数
              适用于用户长时间停顿出乎意料的场景，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              基于当前上下文。

              超时值将在上一个模型响应的音频播放完毕后开始计算，
              即它设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              ）将在达到超时阈值时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）任何正在进行的、向默认
              对话（即。 `conversation` 的 `auto`）输出的响应。若为 `true` ，则该响应将被取消；否则它将继续执行直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位为
              毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止所需的静默时长（单位为毫秒）。默认为
              500ms。使用更小的值时，模型会更快地响应，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更
              高的阈值需要更大的音频音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型判断用户何时结束说话。

            - `type: "semantic_vad"`

              turn detection 的类型， `semantic_vad` 启用语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会更久地等待用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最长超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否通过输出自动中断任何正在进行的响应
              对话（即。 `conversation` 的 `auto`）当 VAD 开始事件发生时。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      服务端输出中要包含的附加字段。

      `item.input_audio_transcription.logprobs`:为输入音频转写包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### 返回

- `expires_at: number`

  客户端密钥的过期时间戳，自纪元起以秒为单位。

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

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪的配置。可以设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，从而提升 VAD 和轮次检测的准确性（减少误报），并提高模型表现。

          - `type: optional NoiseReductionType`

            降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }  or null`

          输入音频转录的配置，默认关闭，可以设置为 `null` 以在开启后关闭。输入音频转录并非模型原生支持，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，因此应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，它们为转录服务提供了额外的指引。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式给出。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            当存在时，为输入音频转录配置的提示。

        - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭轮次检测，在这种情况下，客户端必须手动触发模型响应。

          Server VAD 意味着模型会根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

          Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义层面地判断用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以 "uhhm" 结尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，turn detection 必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              turn detection 的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，由于模型可能已在响应中，可能会导致创建响应失败。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，到时将自动触发模型响应。该参数
              适用于用户长时间停顿出乎意料的场景，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              基于当前上下文。

              超时值将在上一个模型响应的音频播放完毕后开始计算，
              即它设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              ）将在达到超时阈值时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）任何正在进行的、向默认
              对话（即。 `conversation` 的 `auto`）输出的响应。若为 `true` ，则该响应将被取消；否则它将继续执行直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位为
              毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止所需的静默时长（单位为毫秒）。默认为
              500ms。使用更小的值时，模型会更快地响应，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更
              高的阈值需要更大的音频音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型判断用户何时结束说话。

            - `type: "semantic_vad"`

              turn detection 的类型， `semantic_vad` 启用语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会更久地等待用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最长超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否通过输出自动中断任何正在进行的响应
              对话（即。 `conversation` 的 `auto`）当 VAD 开始事件发生时。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应相对于原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行期间更改。

          此参数是对音频生成后的后处理调整，
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的语音。一旦模型至少用音频回应过一次，
          会话中的语音就不能再更改。当前的
          语音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            会话中的语音就不能再更改。当前的
            语音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

      会话的过期时间戳，自纪元起以秒为单位。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      服务端输出中要包含的附加字段。

      `item.input_audio_transcription.logprobs`:为输入音频转写包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型输出期望的回复。可以指示模型回复的内容和格式（例如“极其简洁”、“表现得友好一些”、“以下是优质回复的示例”），以及音频行为（例如“说话要快”、“在声音中注入情绪”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型期望的行为提供了指导。

      请注意，服务端会设置默认指令，如果此字段未设置，则会使用这些默认指令，并在 `session.created` 事件中可见，该事件位于会话开始时。

    - `max_output_tokens: optional number or "inf"`

      单次助手回复的最大输出 token 数，
      包含工具调用。提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或者 `inf` 以使用给定模型支持的最大可用 token 数。默认为
      给定模型的 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的实时模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的实时模型。

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
      模型将同时以音频和转写文本进行响应。 `["text"]` 可用于让
      模型仅以文本形式回复。不能同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解详情](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的变量替换映射，用于在
        提示中替换变量值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像细节级别。其一为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送到模型的文件的 ID。

          - `image_url: optional string or null`

            要发送到模型的图片的 URL。可以是完整的 URL，也可以是 base64 编码的图片 data URL。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的输入文件。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得较低成本的渲染，或使用 `high` 以更高的质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送到模型的文件内容。

          - `file_id: optional string or null`

            要发送到模型的文件的 ID。

          - `file_url: optional string`

            要发送到模型的文件的 URL。

          - `filename: optional string`

            要发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        可选的提示模板版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        支持推理的 Realtime 模型（如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。可以传入字符串模式之一，或强制使用特定的
      函数 / MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 意味着模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
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

    - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括关于何时以及如何
          调用它的指引，以及关于调用时该告诉用户什么
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议
        （MCP）服务器为模型提供更多工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用的上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

          允许的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与
          自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程，并在此处提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。详细了解
          服务连接器 [请参考此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          请使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 通过
          Secure MCP Tunnel 连接。

          当前支持的 `connector_id` 值包括：

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

          此 MCP 工具是否延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。可用于身份验证
          或其他用途。

        - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要批准。可以是
            `always`, `never`，或与需要批准的工具关联的过滤对象
            需要批准的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。之一。设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文信息。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于代替直连服务器 URL 的 Secure MCP Tunnel ID。需提供以下
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [追踪面板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦为某个会话启用
      追踪，配置便不可再修改。

      `auto` 会为该会话创建一个 追踪，并使用默认值填充
      工作流 名称、group id 和 metadata。

      - `Auto = "auto"`

        启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 上的 group id，用于在追踪面板中过滤和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 上的任意元数据，用于启用
          在 Traces Dashboard 中进行筛选。

        - `workflow_name: optional string`

          要附加到此工作流的追踪名称。这用于
          在 Traces Dashboard 中为追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着最早的消息不会包含在模型的上下文之中。对于 32k 上下文且最大输出 token 为 4,096 的模型，在发生截断之前，上文中最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方式。

      截断会减少下一轮中缓存的 token 数量（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文一定比例的消息，从而减少未来截断的需要并提升缓存命中率。

      可以完全禁用截断，这意味着服务器永远不会截断，而是会在对话超过模型的输入 token 上限时返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多个轮次中，有助于提高缓存 token 的使用率。

        - `retention_ratio: number`

          当对话超过输入 token 上限时保留的指令后对话 token 比例（`0.0` - `1.0`)。将其设置为 `0.8` 意味着会丢弃消息，直到使用的 token 达到最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 个 token 时会发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

      会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪配置。

          - `type: optional NoiseReductionType`

            降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }  or null`

          转录模型配置。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式给出。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            当存在时，为输入音频转录配置的提示。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测配置。可设置为 `null` 将其关闭。服务端
          VAD 表示模型将根据
          音量检测语音的开始和结束，并在用户说话结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            VAD 检测到语音前所包含的音频量（以
            毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静默时长（以毫秒为单位）。默认为
            500ms。使用更小的值时，模型会更快地响应，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 至 1.0），默认为 0.5。
            高的阈值需要更大的音频音量才能激活模型，
            因此在嘈杂环境中可能表现更好。

          - `type: optional string`

            轮次检测类型，仅限 `server_vad` 目前可用。

    - `expires_at: optional number`

      会话的过期时间戳，自纪元起以秒为单位。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      服务端输出中要包含的附加字段。

      - `item.input_audio_transcription.logprobs`:为输入音频转写包含 logprobs。

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

## 域类型

### Client Secret 创建响应

- `ClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，自纪元起以秒为单位。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪的配置。可以设置为 `null` 以关闭。
            降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，从而提升 VAD 和轮次检测的准确性（减少误报），并提高模型表现。

            - `type: optional NoiseReductionType`

              降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转录的配置，默认关闭，可以设置为 `null` 以在开启后关闭。输入音频转录并非模型原生支持，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，因此应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，它们为转录服务提供了额外的指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式给出。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              当存在时，为输入音频转录配置的提示。

          - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭轮次检测，在这种情况下，客户端必须手动触发模型响应。

            Server VAD 意味着模型会根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

            Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义层面地判断用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以 "uhhm" 结尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，turn detection 必须
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                turn detection 的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，由于模型可能已在响应中，可能会导致创建响应失败。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，到时将自动触发模型响应。该参数
                适用于用户长时间停顿出乎意料的场景，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                基于当前上下文。

                超时值将在上一个模型响应的音频播放完毕后开始计算，
                即它设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
                ）将在达到超时阈值时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）任何正在进行的、向默认
                对话（即。 `conversation` 的 `auto`）输出的响应。若为 `true` ，则该响应将被取消；否则它将继续执行直到完成。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位为
                毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止所需的静默时长（单位为毫秒）。默认为
                500ms。使用更小的值时，模型会更快地响应，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更
                高的阈值需要更大的音频音量才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型判断用户何时结束说话。

              - `type: "semantic_vad"`

                turn detection 的类型， `semantic_vad` 启用语义 VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会更久地等待用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最长超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否通过输出自动中断任何正在进行的响应
                对话（即。 `conversation` 的 `auto`）当 VAD 开始事件发生时。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行期间更改。

            此参数是对音频生成后的后处理调整，
            也可以提示模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的语音。一旦模型至少用音频回应过一次，
            会话中的语音就不能再更改。当前的
            语音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回应的语音。一旦模型至少用音频回应过一次，
              会话中的语音就不能再更改。当前的
              语音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

        会话的过期时间戳，自纪元起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        服务端输出中要包含的附加字段。

        `item.input_audio_transcription.logprobs`:为输入音频转写包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型输出期望的回复。可以指示模型回复的内容和格式（例如“极其简洁”、“表现得友好一些”、“以下是优质回复的示例”），以及音频行为（例如“说话要快”、“在声音中注入情绪”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型期望的行为提供了指导。

        请注意，服务端会设置默认指令，如果此字段未设置，则会使用这些默认指令，并在 `session.created` 事件中可见，该事件位于会话开始时。

      - `max_output_tokens: optional number or "inf"`

        单次助手回复的最大输出 token 数，
        包含工具调用。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或者 `inf` 以使用给定模型支持的最大可用 token 数。默认为
        给定模型的 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的实时模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          此会话使用的实时模型。

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
        模型将同时以音频和转写文本进行响应。 `["text"]` 可用于让
        模型仅以文本形式回复。不能同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解详情](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的变量替换映射，用于在
          提示中替换变量值。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像细节级别。其一为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送到模型的文件的 ID。

            - `image_url: optional string or null`

              要发送到模型的图片的 URL。可以是完整的 URL，也可以是 base64 编码的图片 data URL。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            模型的输入文件。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              要发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得较低成本的渲染，或使用 `high` 以更高的质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送到模型的文件内容。

            - `file_id: optional string or null`

              要发送到模型的文件的 ID。

            - `file_url: optional string`

              要发送到模型的文件的 URL。

            - `filename: optional string`

              要发送到模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          可选的提示模板版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          支持推理的 Realtime 模型（如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。可以传入字符串模式之一，或强制使用特定的
        函数 / MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 意味着模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
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

      - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指引，以及关于调用时该告诉用户什么
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器为模型提供更多工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用的上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

            允许的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。详细了解
            服务连接器 [请参考此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            请使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 通过
            Secure MCP Tunnel 连接。

            当前支持的 `connector_id` 值包括：

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

            此 MCP 工具是否延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。可用于身份验证
            或其他用途。

          - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要批准。可以是
              `always`, `never`，或与需要批准的工具关联的过滤对象
              需要批准的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。设置为 `always`，时，所有工具都需要审批。当设置为
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文信息。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供以下 `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于代替直连服务器 URL 的 Secure MCP Tunnel ID。需提供以下
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [追踪面板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦为某个会话启用
        追踪，配置便不可再修改。

        `auto` 会为该会话创建一个 追踪，并使用默认值填充
        工作流 名称、group id 和 metadata。

        - `Auto = "auto"`

          启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此 追踪 上的 group id，用于在追踪面板中过滤和
            分组。

          - `metadata: optional unknown`

            附加到此 追踪 上的任意元数据，用于启用
            在 Traces Dashboard 中进行筛选。

          - `workflow_name: optional string`

            要附加到此工作流的追踪名称。这用于
            在 Traces Dashboard 中为追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着最早的消息不会包含在模型的上下文之中。对于 32k 上下文且最大输出 token 为 4,096 的模型，在发生截断之前，上文中最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方式。

        截断会减少下一轮中缓存的 token 数量（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文一定比例的消息，从而减少未来截断的需要并提升缓存命中率。

        可以完全禁用截断，这意味着服务器永远不会截断，而是会在对话超过模型的输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多个轮次中，有助于提高缓存 token 的使用率。

          - `retention_ratio: number`

            当对话超过输入 token 上限时保留的指令后对话 token 比例（`0.0` - `1.0`)。将其设置为 `0.8` 意味着会丢弃消息，直到使用的 token 达到最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 个 token 时会发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

        会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式给出。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              当存在时，为输入音频转录配置的提示。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测配置。可设置为 `null` 将其关闭。服务端
            VAD 表示模型将根据
            音量检测语音的开始和结束，并在用户说话结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到语音前所包含的音频量（以
              毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静默时长（以毫秒为单位）。默认为
              500ms。使用更小的值时，模型会更快地响应，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 至 1.0），默认为 0.5。
              高的阈值需要更大的音频音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测类型，仅限 `server_vad` 目前可用。

      - `expires_at: optional number`

        会话的过期时间戳，自纪元起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        服务端输出中要包含的附加字段。

        - `item.input_audio_transcription.logprobs`:为输入音频转写包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Session Create 响应

- `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

  Realtime 会话配置对象。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `object: "realtime.session"`

    对象类型。始终为 `realtime.session`.

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

      - `noise_reduction: optional object { type }  or null`

        输入音频降噪的配置。可以设置为 `null` 以关闭。
        降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
        对音频进行过滤可以通过改善对输入音频的感知，从而提升 VAD 和轮次检测的准确性（减少误报），并提高模型表现。

        - `type: optional NoiseReductionType`

          降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }  or null`

        输入音频转录的配置，默认关闭，可以设置为 `null` 以在开启后关闭。输入音频转录并非模型原生支持，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，因此应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，它们为转录服务提供了额外的指引。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式给出。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          当存在时，为输入音频转录配置的提示。

      - `turn_detection: optional ServerVad { type, create_response, idle_timeout_ms, 4 more }  or SemanticVad { type, create_response, eagerness, interrupt_response }  or null`

        轮次检测配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭轮次检测，在这种情况下，客户端必须手动触发模型响应。

        Server VAD 意味着模型会根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

        Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义层面地判断用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以 "uhhm" 结尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，turn detection 必须
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            turn detection 的类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，由于模型可能已在响应中，可能会导致创建响应失败。

            如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，到时将自动触发模型响应。该参数
            适用于用户长时间停顿出乎意料的场景，例如电话通话。模型将根据
            当前上下文有效地提示用户继续对话。
            基于当前上下文。

            超时值将在上一个模型响应的音频播放完毕后开始计算，
            即它设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
            ）将在达到超时阈值时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否自动中断（取消）任何正在进行的、向默认
            对话（即。 `conversation` 的 `auto`）输出的响应。若为 `true` ，则该响应将被取消；否则它将继续执行直到完成。

            如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位为
            毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止所需的静默时长（单位为毫秒）。默认为
            500ms。使用更小的值时，模型会更快地响应，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更
            高的阈值需要更大的音频音量才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型判断用户何时结束说话。

          - `type: "semantic_vad"`

            turn detection 的类型， `semantic_vad` 启用语义 VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD 停止事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会更久地等待用户继续说话， `high` 会更快地响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最长超时时间分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否通过输出自动中断任何正在进行的响应
            对话（即。 `conversation` 的 `auto`）当 VAD 开始事件发生时。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音响应相对于原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行期间更改。

        此参数是对音频生成后的后处理调整，
        也可以提示模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回应的语音。一旦模型至少用音频回应过一次，
        会话中的语音就不能再更改。当前的
        语音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的语音。一旦模型至少用音频回应过一次，
          会话中的语音就不能再更改。当前的
          语音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

    会话的过期时间戳，自纪元起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    服务端输出中要包含的附加字段。

    `item.input_audio_transcription.logprobs`:为输入音频转写包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    预置到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型输出期望的回复。可以指示模型回复的内容和格式（例如“极其简洁”、“表现得友好一些”、“以下是优质回复的示例”），以及音频行为（例如“说话要快”、“在声音中注入情绪”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型期望的行为提供了指导。

    请注意，服务端会设置默认指令，如果此字段未设置，则会使用这些默认指令，并在 `session.created` 事件中可见，该事件位于会话开始时。

  - `max_output_tokens: optional number or "inf"`

    单次助手回复的最大输出 token 数，
    包含工具调用。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或者 `inf` 以使用给定模型支持的最大可用 token 数。默认为
    给定模型的 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    此会话使用的实时模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的实时模型。

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
    模型将同时以音频和转写文本进行响应。 `["text"]` 可用于让
    模型仅以文本形式回复。不能同时请求两者 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解详情](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的变量替换映射，用于在
      提示中替换变量值。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像细节级别。其一为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送到模型的文件的 ID。

        - `image_url: optional string or null`

          要发送到模型的图片的 URL。可以是完整的 URL，也可以是 base64 编码的图片 data URL。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        模型的输入文件。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          要发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得较低成本的渲染，或使用 `high` 以更高的质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送到模型的文件内容。

        - `file_id: optional string or null`

          要发送到模型的文件的 ID。

        - `file_url: optional string`

          要发送到模型的文件的 URL。

        - `filename: optional string`

          要发送到模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      可选的提示模板版本。

  - `reasoning: optional RealtimeReasoning`

    支持推理的 Realtime 模型（如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      支持推理的 Realtime 模型（如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型选择工具的方式。可以传入字符串模式之一，或强制使用特定的
    函数 / MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 意味着模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
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

  - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括关于何时以及如何
        调用它的指引，以及关于调用时该告诉用户什么
        （如果有的话）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程模型上下文协议
      （MCP）服务器为模型提供更多工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用的上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

        允许的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与
        自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程，并在此处提供该令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。详细了解
        服务连接器 [请参考此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
        请使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 通过
        Secure MCP Tunnel 连接。

        当前支持的 `connector_id` 值包括：

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

        此 MCP 工具是否延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。可用于身份验证
        或其他用途。

      - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要批准。可以是
          `always`, `never`，或与需要批准的工具关联的过滤对象
          需要批准的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器被 [标记为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`。之一。设置为 `always`，时，所有工具都需要审批。当设置为
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文信息。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供以下 `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于代替直连服务器 URL 的 Secure MCP Tunnel ID。需提供以下
        `server_url`, `connector_id`，或 `tunnel_id` 之一。

  - `tracing: optional "auto" or TracingConfiguration { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入到 [追踪面板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦为某个会话启用
    追踪，配置便不可再修改。

    `auto` 会为该会话创建一个 追踪，并使用默认值填充
    工作流 名称、group id 和 metadata。

    - `Auto = "auto"`

      启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此 追踪 上的 group id，用于在追踪面板中过滤和
        分组。

      - `metadata: optional unknown`

        附加到此 追踪 上的任意元数据，用于启用
        在 Traces Dashboard 中进行筛选。

      - `workflow_name: optional string`

        要附加到此工作流的追踪名称。这用于
        在 Traces Dashboard 中为追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着最早的消息不会包含在模型的上下文之中。对于 32k 上下文且最大输出 token 为 4,096 的模型，在发生截断之前，上文中最多只能包含 28,224 个 token。

    客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方式。

    截断会减少下一轮中缓存的 token 数量（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断以保留最多达到最大上下文一定比例的消息，从而减少未来截断的需要并提升缓存命中率。

    可以完全禁用截断，这意味着服务器永远不会截断，而是会在对话超过模型的输入 token 上限时返回错误。

    - `"auto" or "disabled"`

      会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超过输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多个轮次中，有助于提高缓存 token 的使用率。

      - `retention_ratio: number`

        当对话超过输入 token 上限时保留的指令后对话 token 比例（`0.0` - `1.0`)。将其设置为 `0.8` 意味着会丢弃消息，直到使用的 token 达到最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

        - `post_instructions: optional number`

          指令之后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的对话超过 5,000 个 token 时会发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Transcription Session Create 响应

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

    会话的输入音频配置。

    - `input: optional object { format, noise_reduction, transcription, turn_detection }`

      - `format: optional RealtimeAudioFormats`

        PCM 音频格式。仅支持 24kHz 采样率。

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

      - `noise_reduction: optional object { type }  or null`

        输入音频降噪配置。

        - `type: optional NoiseReductionType`

          降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }  or null`

        转录模型配置。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式给出。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          当存在时，为输入音频转录配置的提示。

      - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

        轮次检测配置。可设置为 `null` 将其关闭。服务端
        VAD 表示模型将根据
        音量检测语音的开始和结束，并在用户说话结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          VAD 检测到语音前所包含的音频量（以
          毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          检测语音停止的静默时长（以毫秒为单位）。默认为
          500ms。使用更小的值时，模型会更快地响应，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 至 1.0），默认为 0.5。
          高的阈值需要更大的音频音量才能激活模型，
          因此在嘈杂环境中可能表现更好。

        - `type: optional string`

          轮次检测类型，仅限 `server_vad` 目前可用。

  - `expires_at: optional number`

    会话的过期时间戳，自纪元起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    服务端输出中要包含的附加字段。

    - `item.input_audio_transcription.logprobs`:为输入音频转写包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session 轮次检测

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 将其关闭。服务端
  VAD 表示模型将根据
  音量检测语音的开始和结束，并在用户说话结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音前所包含的音频量（以
    毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静默时长（以毫秒为单位）。默认为
    500ms。使用更小的值时，模型会更快地响应，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 至 1.0），默认为 0.5。
    高的阈值需要更大的音频音量才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅限 `server_vad` 目前可用。
