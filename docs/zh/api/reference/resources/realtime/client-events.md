# Realtime 客户端事件

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

这些是 OpenAI Realtime WebSocket 服务器将接受来自客户端的事件。

<a id="session.update"></a>

## session.update

发送该事件以更新会话的配置。
客户端可以随时发送此事件以更新任何字段
除了 `voice` 和 `model`. `voice` 仅当尚未产生其他音频输出时才能更新。

当服务器收到 `session.update`，时，它会响应
一个 `session.updated` 事件，其中展示完整且生效的配置。
仅会更新 `session.update` 中存在的字段。要清除类似于
`instructions`，的字段，请传入空字符串。要清除类似于 `tools`，的字段，请传入空数组。
要清除类似于 `turn_detection`，的字段，请传入 `null`.

### Schema

Schema name: `RealtimeClientEventSessionUpdate`

- `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  更新 Realtime 会话。选择 realtime
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。始终 `realtime` ，用于 Realtime API。

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

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送到 VAD 和模型之前对其添加的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，从而提升 VAD 和轮次检测的准确性（减少误报），并提升模型表现。

          - `type: optional NoiseReductionType`

            降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认为关闭，可设置为 `null` 一旦开启便无法关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步执行，应将其视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，这些为转录服务提供额外的指引。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转录文本之前的等待时长。
            较高的值可以提高转录准确率，但会增加延迟。
            仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 时可用。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。以
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            提供将提高准确率和延迟表现。

          - `languages: optional array of string`

            输入音频的可能语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            用于引导模型风格或延续上一段音频的可选文本。
            片段。
            对于 `whisper-1`，prompt 是一个关键字列表 [，prompt 是一个关键字列表](https://developers.openai.com/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一段自由文本，例如 "expect words related to technology"。
            以下模型不支持 prompt： `gpt-realtime-whisper` 时可用。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可为 Server VAD 或 Semantic VAD。可以将其设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）在语义层面估计用户是否已结束发言，然后根据该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 收尾，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续发言。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须设置为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` 如果模型已经在响应，这可能会导致创建响应失败。

              如果两者同时 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              用于在多长时间后自动触发模型响应的可选超时。这在
              用户长时间停顿属于意外情况的场景下非常有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续
              对话。

              超时值将在上一次模型响应的音频播放完毕之后开始计算，
              也就是说，超时设置为上一次响应的结束 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联
              的事件）将在达到超时时被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）向默认
              对话输出（即。 `conversation` 的 `auto`）的当前响应。如果 `true` 则响应将被取消，否则将持续运行直到完成。

              如果两者同时 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位为
              毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（单位为毫秒）。默认
              为 500ms。该值越短，模型响应越快，
              但可能会抢接用户的短暂停顿。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。阈值
              越高，激活模型所需的音频音量越大，因此在
              嘈杂环境下的表现可能会更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，通过模型判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 会等待更长时间以便用户继续说话， `high` 则会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 分别具有 8s、4s 和 2s 的最长超时时间。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在使用默认输出时自动中断任何正在进行的响应
              对话输出（即。 `conversation` 的 `auto`) 当 VAD 开始事件发生时。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回复的速度，相对于原始速度的倍数。
          1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。该值只能在模型轮次之间更改，不能在响应进行中更改。

          此参数是对生成后音频的后处理调整，你
          也可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回复的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义 voice 对象，
          一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
          在会话进行期间就无法再更改声音。
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

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      添加到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以通过指令引导回复内容和格式（例如"极其简洁"、"表现友好"、"以下是较好的回复示例"），以及音频行为（例如"说得快一些"、"在声音中注入情感"、"经常笑"）。该指令不一定会被模型严格遵循，但它为模型提供了期望行为的指导。

      请注意，服务端会设置默认指令，在未设置本字段时将使用该默认指令，且这些默认指令可在会话开头的 `session.created` 事件中查看。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包含工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或者 `inf` 对于给定模型的最大可用 token 数。默认为
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

      模型可以响应的模态集合。默认为 `["audio"]`，表示
      模型将返回音频并附带转录文本。 `["text"]` 可用于让
      模型仅返回文本。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅
      推理类 Realtime 模型支持，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的值映射，用于替换你
        提示中的变量。替换值可以是字符串，也可以是其他
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

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](https://developers.openai.com/api/docs/guides/images-vision).

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

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 用量。使用 `low` 可降低渲染成本，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `file_url: optional string`

            要发送到模型的文件的 URL。

          - `filename: optional string`

            要发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        对支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型选择工具的方式。提供一个字符串模式，或强制使用特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有的话）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用特定的函数。

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

          函数的描述，包括何时以及如何调用它的指导，以及在调用时
          应向用户说明的内容（如有）。
          （如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        （MCP）服务器为模型提供额外工具访问能力。 [详细了解 MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          该 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型，始终为 `mcp`.

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

              指示该工具是否会修改数据或是否为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器配合使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的服务连接器。二者之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。详细了解
          服务连接器 [此处](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对于 2026 年 9 月 1 日之后发布的模型已被弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或使用 `tunnel_id` 以
          通过安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的值为：

          - Dropbox: `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google Calendar: `connector_googlecalendar`
          - Google Drive: `connector_googledrive`
          - Microsoft Teams: `connector_microsoftteams`
          - Outlook Calendar: `connector_outlookcalendar`
          - Outlook 邮件： `connector_outlookemail`
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

          该 MCP 工具是否被延迟，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要批准。可以是
            `always`, `never`,或与需要批准的工具关联的筛选对象
            ，这些工具需要批准。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示该工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示该工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的批准策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要批准。当
            设置为 `never`，时，所有工具都不需要批准。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的安全 MCP 隧道 ID。可选值为
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
      追踪在会话中启用后，配置便无法修改。

      `auto` 将使用默认值创建该会话的追踪，包括
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并为追踪配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        用于追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪的组 ID，用于在
          Traces Dashboard 中进行筛选和分组。

        - `metadata: optional unknown`

          附加到此追踪的任意元数据，用于在
          Traces Dashboard 中进行筛选。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称。该名称用于
          在 Traces Dashboard 中命名该追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，意味着最早的消息将不会被纳入模型的上下文中。一个 32k 上下文、最大输出 4,096 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的 token 上限进行截断，这是控制 token 使用量和成本的有效方式。

      截断会减少下一轮中被缓存的 token 数量（破坏缓存），因为消息会从上下文开头被丢弃。然而，客户端也可以将截断配置为保留最大上下文大小一定比例内的消息，这有助于减少后续的截断次数，从而提高缓存命中率。

      截断可以完全禁用，这意味着服务器永远不会截断，但如果对话超过模型的输入 token 上限，会返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留对话 token 的一部分。这允许你将截断分摊到多个轮次中，有助于提高被缓存 token 的使用率。

        - `retention_ratio: number`

          在指令后的对话中要保留的 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限时生效。设置为 `0.8` 表示会丢弃消息，直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例进行截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后对话中允许的最大 token 数（其中包括工具定义）。例如，将其设置为 5,000 意味着当对话在指令之后超过 5,000 个 token 时就会触发截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。始终 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送到 VAD 和模型之前对其添加的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，从而提升 VAD 和轮次检测的准确性（减少误报），并提升模型表现。

          - `type: optional NoiseReductionType`

            降噪的类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认为关闭，可设置为 `null` 一旦开启便无法关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步执行，应将其视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以选择性地设置转录的语言和提示词，这些为转录服务提供额外的指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可为 Server VAD 或 Semantic VAD。可以将其设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）在语义层面估计用户是否已结束发言，然后根据该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 收尾，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续发言。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须设置为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` 如果模型已经在响应，这可能会导致创建响应失败。

              如果两者同时 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              用于在多长时间后自动触发模型响应的可选超时。这在
              用户长时间停顿属于意外情况的场景下非常有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续
              对话。

              超时值将在上一次模型响应的音频播放完毕之后开始计算，
              也就是说，超时设置为上一次响应的结束 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联
              的事件）将在达到超时时被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）向默认
              对话输出（即。 `conversation` 的 `auto`）的当前响应。如果 `true` 则响应将被取消，否则将持续运行直到完成。

              如果两者同时 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位为
              毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（单位为毫秒）。默认
              为 500ms。该值越短，模型响应越快，
              但可能会抢接用户的短暂停顿。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。阈值
              越高，激活模型所需的音频音量越大，因此在
              嘈杂环境下的表现可能会更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，通过模型判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 会等待更长时间以便用户继续说话， `high` 则会更快地响应。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 分别具有 8s、4s 和 2s 的最长超时时间。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在使用默认输出时自动中断任何正在进行的响应
              对话输出（即。 `conversation` 的 `auto`) 当 VAD 开始事件发生时。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

- `type: "session.update"`

  事件类型，必须为 `session.update`.

  - `"session.update"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。这是由客户端自行指定的任意字符串。如果事件发生错误，该 ID 会被回传，但对应的 `session.updated` 事件中不会包含它。

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

发送此事件可向输入音频缓冲区追加音频字节。该音频
缓冲区是临时存储，你可以向其写入内容，并在稍后进行 “提交”。“提交” 会基于缓冲区内容在对话历史中创建一个新的
用户消息条目，并清空缓冲区。
输入音频转录（如果启用）将在缓冲区提交时生成。

如果启用了 VAD，音频缓冲区会用于检测语音，并由服务端决定
何时提交。当禁用 Server VAD 时，你必须手动提交音频缓冲区。
输入音频降噪会在向音频缓冲区写入时生效。

客户端可以选择在每个事件中放入多少音频，单个事件最大为
15 MiB，例如从客户端以较小的分块流式传输可以让
VAD 响应更及时。与大多数其他客户端事件不同，服务端
不会针对此事件发送确认响应。

### Schema

Schema name: `RealtimeClientEventInputAudioBufferAppend`

- `audio: string`

  Base64 编码的音频字节。格式必须与会话配置中的
  `input_audio_format` 字段一致。

- `type: "input_audio_buffer.append"`

  事件类型，必须为 `input_audio_buffer.append`.

  - `"input_audio_buffer.append"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

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

发送此事件以提交用户输入音频缓冲区，它将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但它不会让模型生成响应。服务端将以一个 `input_audio_buffer.committed` 事件进行响应。

### Schema

Schema name: `RealtimeClientEventInputAudioBufferCommit`

- `type: "input_audio_buffer.commit"`

  事件类型，必须为 `input_audio_buffer.commit`.

  - `"input_audio_buffer.commit"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

### 示例

```json
{
    "event_id": "event_789",
    "type": "input_audio_buffer.commit"
}
```

<a id="input_audio_buffer.clear"></a>

## input_audio_buffer.clear

发送此事件以清除缓冲区中的音频字节。服务端将
以 `input_audio_buffer.cleared` 事件进行响应。

### Schema

Schema name: `RealtimeClientEventInputAudioBufferClear`

- `type: "input_audio_buffer.clear"`

  事件类型，必须为 `input_audio_buffer.clear`.

  - `"input_audio_buffer.clear"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

### 示例

```json
{
    "event_id": "event_012",
    "type": "input_audio_buffer.clear"
}
```

<a id="conversation.item.create"></a>

## conversation.item.create

向会话的上下文中添加新的 Item，包括消息、函数
调用和函数调用响应。该事件既可用于填充会话的
"历史记录"，也可在流式传输中途添加新的 Item，但当前存在一个
限制，即无法填充助手音频消息。

如果成功，服务端将响应一个 `conversation.item.created`
事件，否则将发送一个 `error` 事件。

### Schema

Schema name: `RealtimeClientEventConversationItemCreate`

- `item: ConversationItem`

  Realtime 会话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时点添加。对于会话行为的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。对于系统消息始终为 `input_text` 。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。对于系统消息始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。对于系统消息始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对会话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 会话中的用户消息条目。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的细节级别（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

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

      消息发送者的角色。对于系统消息始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。对于系统消息始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对会话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息项。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16-bit 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的转录文本，当输出类型为时，该字段始终存在 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。对于系统消息始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。对于系统消息始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对会话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用项。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。对于系统消息始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对会话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出项。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，此字段为自由文本，可以包含任何信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。对于系统消息始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对会话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的 Realtime 项。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      所应答的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。对于系统消息始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      该决定的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 项目，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注解。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。对于系统消息始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 项目，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      所运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。对于系统消息始终为 `mcp_call`.

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

    一个 Realtime 项目，请求人工批准某个工具调用。

    - `id: string`

      批准请求的唯一 ID。

    - `arguments: string`

      该工具的参数 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。对于系统消息始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.create"`

  事件类型，必须为 `conversation.item.create`.

  - `"conversation.item.create"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

- `previous_item_id: optional string`

  新项将插入到其之后的上一项的 ID。如果未设置，新项将追加到对话末尾。

  If set to `root`, 新项将添加到对话的开头。

  如果设置为现有 ID，则可以在对话中间插入一个项。如果找不到该 ID，将返回错误，并且不会添加该项。

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

当你希望检索服务器对会话历史中某个特定条目的表示时，发送此事件。例如，这可用于在降噪和 VAD 之后检查用户音频。
服务器将响应一个 `conversation.item.retrieved` 事件，
除非该条目在会话历史中不存在，此时
服务器将返回错误。

### Schema

Schema name: `RealtimeClientEventConversationItemRetrieve`

- `item_id: string`

  要检索的条目 ID。

- `type: "conversation.item.retrieve"`

  事件类型，必须为 `conversation.item.retrieve`.

  - `"conversation.item.retrieve"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

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

发送此事件以截断先前助手消息的音频。服务端
将以快于实时的速度生成音频，因此当用户
中断以截断已发送到客户端但尚未播放
的音频时，此事件非常有用。这将使服务端对音频的理解与
客户端的播放保持同步。

截断音频将删除服务端的文本转录内容，以确保不
会存在用户尚未听到的上下文文本。

如果成功，服务端将响应一个 `conversation.item.truncated`
事件进行响应。

### Schema

Schema name: `RealtimeClientEventConversationItemTruncate`

- `audio_end_ms: number`

  对音频进行截断的包含性时长上限，单位为毫秒。如果
  audio_end_ms 大于音频的实际时长，服务端
  将返回错误。

- `content_index: number`

  要截断的内容部分的索引。将其设置为 `0`.

- `item_id: string`

  要截断的助手消息项的 ID。只有助手消息
  项可以被截断。

- `type: "conversation.item.truncate"`

  事件类型，必须为 `conversation.item.truncate`.

  - `"conversation.item.truncate"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

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

当你想要从对话中移除任何条目时，发送此事件
历史记录。服务端将响应一个 `conversation.item.deleted` 事件，
除非该条目在会话历史中不存在，此时
服务器将返回错误。

### Schema

Schema name: `RealtimeClientEventConversationItemDelete`

- `item_id: string`

  要删除项的 ID。

- `type: "conversation.item.delete"`

  事件类型，必须为 `conversation.item.delete`.

  - `"conversation.item.delete"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

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
模型推理。在 Server VAD 模式下，服务端会自动创建 Response
。

一个 Response 至少包含一个 Item，也可能包含两个 Item，此时
第二个将是一个函数调用。这些 Item 会被追加到
默认情况下保留对话历史。

服务器将响应一个 `response.created` 针对 Items 的事件（events）
以及已创建的内容，最后是表示 `response.done` 的 completed 事件，用于指示
Response 已完成。

该 `response.create` 事件包含诸如推理配置之类的内容
`instructions` 和 `tools`。如果设置了这些参数，它们将仅针对本次 Response 覆盖会话的
配置。

Response 可以在默认对话之外创建，这意味着它们可以
包含任意输入，并且可以选择不将输出写入对话。
同一时刻只能有一个 Response 向默认对话写入，但除此之外，可以并行创建多个
Response。 `metadata` 字段是区分多个同时进行的 Response 的好方法。
多个同时进行的 Response。

客户端可以设置 `conversation` 来 `none` 来创建一个不会写入默认
会话的 Response。可通过 `input` 字段提供任意输入，该字段是一个数组，接受
原始 Item 以及对现有 Item 的引用。

### Schema

Schema name: `RealtimeClientEventResponseCreate`

- `type: "response.create"`

  事件类型，必须为 `response.create`.

  - `"response.create"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

- `response: optional RealtimeResponseCreateParams`

  使用这些参数创建一个新的 Realtime 响应

  - `audio: optional RealtimeResponseCreateAudioOutput`

    音频输入和输出的配置。

    - `output: optional object { format, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

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

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于回复的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义 voice 对象，
        一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
        在会话进行期间就无法再更改声音。
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

  - `conversation: optional string or "auto" or "none"`

    控制响应添加到哪个对话。当前支持
    `auto` 和 `none`，默认值为 `auto` 。该 `auto` value
    表示响应的内容将被添加到默认
    对话中。将其设置为 `none` 可以创建一个带外响应，该响应
    不会向默认对话添加条目。

    - `string`

    - `"auto" or "none"`

      控制响应添加到哪个对话。当前支持
      `auto` 和 `none`，默认值为 `auto` 。该 `auto` value
      表示响应的内容将被添加到默认
      对话中。将其设置为 `none` 可以创建一个带外响应，该响应
      不会向默认对话添加条目。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    在模型的提示中要包含的输入项。使用此字段
    会为该 Response 创建一个新的上下文，而不是使用默认的
    对话。传入空数组 `[]` 会清除该 Response 的上下文。
    请注意，这可以包含对先前在会话中出现过的项的引用，
    通过其 id 引用。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时点添加。对于会话行为的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对会话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 会话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

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

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对会话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16-bit 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时，该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对会话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对会话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，此字段为自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符，对于系统消息始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对会话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        该决定的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项目，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

      一个 Realtime 项目，请求人工批准某个工具调用。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        该工具的参数 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    在模型调用前会预置的默认系统指令（即 system message）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的指示（例如“说得快一些”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型的期望行为提供了引导。
    请注意，服务端会设置默认指令，在未设置本字段时将使用该默认指令，且这些默认指令可在会话开头的 `session.created` 事件中查看。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包含工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或者 `inf` 对于给定模型的最大可用 token 数。默认为
    给定模型的 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 组键值对。这可用于
    以结构化格式存储对象的附加信息，并通过
    API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的值为
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    输出设置为 `text` 模式将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅
    推理类 Realtime 模型支持，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的值映射，用于替换你
      提示中的变量。替换值可以是字符串，也可以是其他
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

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](https://developers.openai.com/api/docs/guides/images-vision).

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

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 用量。使用 `low` 可降低渲染成本，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `file_url: optional string`

          要发送到模型的文件的 URL。

        - `filename: optional string`

          要发送到模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      对支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型选择工具的方式。提供一个字符串模式，或强制使用特定的
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（如果有的话）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用特定的函数。

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

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何调用它的指导，以及在调用时
        应向用户说明的内容（如有）。
        （如有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      （MCP）服务器为模型提供额外工具访问能力。 [详细了解 MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        该 MCP 服务器的标签，用于在工具调用中识别它。

      - `type: "mcp"`

        MCP 工具的类型，始终为 `mcp`.

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

            指示该工具是否会修改数据或是否为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器配合使用。你的应用
        必须处理 OAuth 授权流程并在此处提供令牌。
        必须处理 OAuth 授权流程并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的服务连接器。二者之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。详细了解
        服务连接器 [此处](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

        此字段对于 2026 年 9 月 1 日之后发布的模型已被弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或使用 `tunnel_id` 以
        通过安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的值为：

        - Dropbox: `connector_dropbox`
        - Gmail: `connector_gmail`
        - Google Calendar: `connector_googlecalendar`
        - Google Drive: `connector_googledrive`
        - Microsoft Teams: `connector_microsoftteams`
        - Outlook Calendar: `connector_outlookcalendar`
        - Outlook 邮件： `connector_outlookemail`
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

        该 MCP 工具是否被延迟，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要批准。可以是
          `always`, `never`,或与需要批准的工具关联的筛选对象
          ，这些工具需要批准。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示该工具是否会修改数据或是否为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示该工具是否会修改数据或是否为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的批准策略。可选值为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要批准。当
          设置为 `never`，时，所有工具都不需要批准。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于代替直接服务器 URL 的安全 MCP 隧道 ID。可选值为
        `server_url`, `connector_id`，或 `tunnel_id` 之一。

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

发送此事件以取消正在进行的响应。服务器将响应
一个 `response.done` 事件，状态为 `response.status=cancelled`。如果没有可取消的响应，
服务器将返回错误。即使没有正在进行的响应，也可以安全地
调用 `response.cancel` ，将返回错误，会话不会受到影响。
会话将保持不受影响。

### Schema

Schema name: `RealtimeClientEventResponseCancel`

- `type: "response.cancel"`

  事件类型，必须为 `response.cancel`.

  - `"response.cancel"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

- `response_id: optional string`

  要取消的特定响应 ID——如果未提供，将取消默认会话中正在进行的
  响应。

### 示例

```json
{
    "type": "response.cancel",
    "response_id": "resp_12345"
}
```

<a id="output_audio_buffer.clear"></a>

## output_audio_buffer.clear

**仅限 WebRTC/SIP：** 发出此事件以截断当前的音频响应。这将触发服务端
停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
事件之前应有一个 `response.cancel` 客户端事件来停止
当前响应的生成。
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
