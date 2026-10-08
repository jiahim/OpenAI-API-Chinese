# Realtime 客户端事件

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获得页面的 Markdown 版本。

这些是 OpenAI Realtime WebSocket 服务器将从客户端接受的事件。

<a id="session.update"></a>

## session.update

发送此事件以更新会话的配置。
客户端可以随时发送此事件以更新任何字段
除以下字段外 `voice` 以及 `model`. `voice` 仅在没有其他音频输出的情况下才能更新。

当服务器收到 `session.update`，时，它将响应
一个 `session.updated` 事件，显示完整且生效的配置。
只有 `session.update` 中存在的字段才会被更新。若要清除类似
`instructions`，的字段，请传入空字符串。若要清除类似 `tools`，的字段，请传入空数组。
若要清除类似 `turn_detection`，的字段，请传入 `null`.

若要关闭输入音频降噪，请发送以下 Realtime 事件：

```json
{"type":"session.update","session":{"type":"realtime","audio":{"input":{"noise_reduction":null}}}}
```

对于转录会话，请使用 `"type":"transcription"` 中包含 `session`.
省略 `audio.input.noise_reduction` 中的字段会保持其当前设置不变。

### Schema

架构名称： `RealtimeClientEventSessionUpdate`

- `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  更新 Realtime 会话。选择 realtime
  会话或转写会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

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

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以提升 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近场麦克风， `far_field` 适用于笔记本或会议室麦克风等远场麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认关闭，可设置为 `null` 开启后若需关闭一次。由于模型直接消费音频，因此输入音频转录并非模型原生功能。转录通过 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的引导，而非模型所听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外的引导。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制在模型发出转录文本之前等待的时间。
            较高的值可以提升转录准确率，但会增加延迟。
            仅在 `gpt-realtime-whisper` 的正式版实时会话中支持。

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
            提供将提升准确率和延迟表现。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要带说话人标签的说话人 diarization 时，请使用 `gpt-4o-transcribe-diarize` 。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前的选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要带说话人标签的说话人 diarization 时，请使用 `gpt-4o-transcribe-diarize` 。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            用于引导模型风格或延续上一段音频的可选文本
            片段。
            对于 `whisper-1`，该 [prompt 是关键词列表](https://developers.openai.com/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是自由文本字符串，例如 "expect words related to technology"。
            以下模型不支持 Prompt： `gpt-realtime-whisper` 的正式版实时会话中支持。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以将其设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型会根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）在语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的声音以 "uhhm" 拖尾，模型会给出较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须设置为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` 如果模型已经在响应，则这可能会创建响应失败。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过后将自动触发模型响应。这是
              在用户长时间停顿属于意外情况的场景下非常有用，例如电话
              通话。模型将基于当前上下文有效地提示用户继续对话
              。

              该超时值将在最后一次模型响应的音频播放完毕后生效，
              即设置为该 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的
              事件）将在达到超时时被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）任何正在进行的、向默认
              会话（即。 `conversation` 的 `auto`）输出内容的响应。如果 `true` 则响应将被取消，否则将持续到完成为止。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
              毫秒计）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒计）。默认
              为 500ms。值越小，模型响应越快，
              但也可能在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
              阈值越高，需要更响亮的音频才能激活模型，并且
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            使用模型判断用户何时结束说话的服务端语义轮次检测。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 会更长时间等待用户继续说话， `high` 而响应更快。 `auto` 为默认值，且等同于 `medium`. `low`, `medium`，以及 `high` 的超时时间分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在发生 VAD 开始事件时，自动使用输出中断正在进行的响应并切换到默认
              会话（即。 `conversation` 的 `auto`）当 VAD 开始事件发生时。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回复的速度，相对于原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

          该参数是对生成后音频的后处理调整，
          也可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

          模型用于回复的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以通过
          一个 `id`，提供自定义声音对象，例如 `{ "id": "voice_1234" }`。在会话期间，一旦模型
          至少回复过一次音频后，就不能再更改声音。
          自定义语音必须通过音频样本创建。
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

      包含在服务端输出中的其他字段。

      `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“说话要快”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指导。

      请注意，服务端会设置默认指令，如果未设置此字段，则会使用这些默认指令，并在 `session.created` 会话开始时触发事件。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应中输出 token 的最大数量，
      其中包含工具调用。提供一个 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 指定模型可用的最大
      token 数量。默认为 `inf`.

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

      模型可用于响应的模态集合。默认为 `["audio"]`，表示
      模型将使用音频加文字记录进行响应。 `["text"]` 可用于让
      模型仅以文本响应。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以在并行状态下调用多个工具。仅支持
      以下推理 Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示词模板及其变量的引用。
      [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示词模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选映射，包含要替换到
        提示词变量中的值。替换值可以是字符串或其他
        Response 输入类型，如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](https://developers.openai.com/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，之一，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 进行较低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送到模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `file_url: optional string`

            要发送到模型的文件的 URL。

          - `filename: optional string`

            要发送到模型的文件名。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（如
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

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用特定函数。

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

          函数的描述，包括关于何时以及如何调用它的指引，
          以及在调用时向用户说明什么的指引
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          JSON Schema 中的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议
        （MCP）服务器为模型提供额外的工具访问能力。 [了解更多关于 MCP 的信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可配合
          自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程，并在此处提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其一
          `server_url`, `connector_id`，之一，或 `tunnel_id` 必须提供。了解详情
          关于服务连接器 [请参阅此处](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 使用
          通过 Secure MCP 隧道进行连接。

          当前支持 `connector_id` 的值包括：

          - Dropbox: `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google Calendar: `connector_googlecalendar`
          - Google Drive: `connector_googledrive`
          - Microsoft Teams: `connector_microsoftteams`
          - Outlook 日历： `connector_outlookcalendar`
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

          此 MCP 工具是否为延迟工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要批准。可以是
            `always`, `never`，或与工具关联的过滤器对象
            需要批准的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单个批准策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
            设置为 `never`，时，所有工具都不需要批准。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下之一 `server_url`, `connector_id`，之一，或
          `tunnel_id` 。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的安全 MCP 隧道 ID。需提供以下之一
          `server_url`, `connector_id`，之一，或 `tunnel_id` 。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 以禁用追踪。一旦
      追踪 为某个会话启用，该配置便无法再修改。

      `auto` 将为该会话创建一个 追踪，并使用默认的
      工作流 名称、group id 和元数据。

      - `Auto = "auto"`

        启用 追踪 并为 追踪 配置选项设置默认值。总是 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 的 group id，用于在追踪仪表盘中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于在
          追踪仪表盘中启用筛选。

        - `workflow_name: optional string`

          附加到此 工作流 的名称，用于标识此 追踪。它用于
          在追踪仪表盘中为该 追踪 命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着从最早的消息开始将不会被包含在模型的上下文中。一个具有 4,096 最大输出 token 的 32k 上下文模型在发生截断前，上下文中最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方法。

      截断会减少下一轮中缓存的 token 数量（破坏缓存），因为消息会从上下文开头被丢弃。然而，客户端也可以配置截断以保留最多占最大上下文一定比例的消息，从而减少未来截断的需求，进而提高缓存命中率。

      截断也可以完全禁用，这意味着服务端永远不会截断，而会在对话超过模型输入 token 上限时报错。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 限制时，保留一部分对话 token。这样可以将截断摊分到多个轮次，有助于提高缓存 token 的使用率。

        - `retention_ratio: number`

          当对话超过输入 token 限制时，保留的指令后对话 token 比例（`0.0` - `1.0`）。将其设置为 `0.8` 表示在使用的 token 达到允许的最大值的 80% 之前，消息将被丢弃。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例进行截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 限制。如果未提供，则使用模型的默认 token 限制。

          - `post_instructions: optional number`

            指令（包括工具定义）后允许在对话中使用的最大 token 数。例如，将其设置为 5,000 表示当指令后的对话超过 5,000 个 token 时将进行截断。此值不能高于模型的上下文窗口大小减去最大输出 token 数。

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
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以提升 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近场麦克风， `far_field` 适用于笔记本或会议室麦克风等远场麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认关闭，可设置为 `null` 开启后若需关闭一次。由于模型直接消费音频，因此输入音频转录并非模型原生功能。转录通过 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的引导，而非模型所听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些会为转录服务提供额外的引导。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以将其设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型会根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）在语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的声音以 "uhhm" 拖尾，模型会给出较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须设置为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。如果 `interrupt_response` 设置为 `false` 如果模型已经在响应，则这可能会创建响应失败。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过后将自动触发模型响应。这是
              在用户长时间停顿属于意外情况的场景下非常有用，例如电话
              通话。模型将基于当前上下文有效地提示用户继续对话
              。

              该超时值将在最后一次模型响应的音频播放完毕后生效，
              即设置为该 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的
              事件）将在达到超时时被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）任何正在进行的、向默认
              会话（即。 `conversation` 的 `auto`）输出内容的响应。如果 `true` 则响应将被取消，否则将持续到完成为止。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
              毫秒计）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒计）。默认
              为 500ms。值越小，模型响应越快，
              但也可能在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
              阈值越高，需要更响亮的音频才能激活模型，并且
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            使用模型判断用户何时结束说话的服务端语义轮次检测。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 会更长时间等待用户继续说话， `high` 而响应更快。 `auto` 为默认值，且等同于 `medium`. `low`, `medium`，以及 `high` 的超时时间分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在发生 VAD 开始事件时，自动使用输出中断正在进行的响应并切换到默认
              会话（即。 `conversation` 的 `auto`）当 VAD 开始事件发生时。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      包含在服务端输出中的其他字段。

      `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

- `type: "session.update"`

  事件类型，必须为 `session.update`.

  - `"session.update"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。这是客户端可指定的任意字符串。如果事件发生错误，它会被传回，但对应的 `session.updated` 事件将不包含它。

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

发送此事件可将音频字节追加到输入音频缓冲区。音频
缓冲区是你可以写入的临时存储，稍后可提交。“提交”会基于缓冲区内容在对话历史中创建新的
用户消息条目，并清空缓冲区。
输入音频转录（如果启用）将在缓冲区提交时生成。

如果启用了 VAD，音频缓冲区用于检测语音，并由服务端决定何时提交。当服务端 VAD 被禁用时，你必须手动提交音频缓冲区。
提交音频缓冲区。输入音频降噪作用于对音频缓冲区的写入。
对音频缓冲区的写入会进行输入音频降噪处理。

客户端可以自行决定每个事件中放入多少音频，单次最多
15 MiB；例如，从客户端流式传输较小的分块可以让 VAD
响应更及时。与大多数其他客户端事件不同，服务端不会
针对该事件发送确认响应。

### Schema

架构名称： `RealtimeClientEventInputAudioBufferAppend`

- `audio: string`

  Base64 编码的音频字节。其格式必须与会话配置中的
  `input_audio_format` 字段指定的格式一致。

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

发送该事件以提交用户输入音频缓冲区，这会在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，该事件会产生错误。在服务端 VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

提交输入音频缓冲区会触发输入音频转录（如果会话配置中已启用），但不会由模型生成响应。服务端会以 `input_audio_buffer.committed` 事件作为响应。

### Schema

架构名称： `RealtimeClientEventInputAudioBufferCommit`

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

发送此事件以清除缓冲区中的音频字节。服务端将
响应一个 `input_audio_buffer.cleared` 事件作为响应。

### Schema

架构名称： `RealtimeClientEventInputAudioBufferClear`

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

向会话上下文添加新条目，包括消息、函数
调用和函数调用响应。该事件既可用于填充会话
“的“历史记录”，也可用于在流式传输过程中添加新条目，但存在当前
限制，即无法填充助手音频消息。

如果成功，服务端将发出一个 `conversation.item.added` 事件，并且，
在该条目完成时，还会发出一个 `conversation.item.done` 事件。否则，将发送一个
`error` 事件。

### Schema

架构名称： `RealtimeClientEventConversationItemCreate`

- `item: ConversationItem`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任意时刻添加。对于会话行为的重大更改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` ，用于系统消息。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      该项的状态。对对话无影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息项。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的细节级别（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`），以数据 URI 的形式提供。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的文字转录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，之一，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      该项的状态。对对话无影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息条目。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字转录，当输出类型为时，该字段始终存在 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      该项的状态。对对话无影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用条目。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      该项的状态。对对话无影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出条目。

    - `call_id: string`

      该输出所对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，此为自由文本，可以包含任意信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      该项的状态。对对话无影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    用于响应 MCP 审批请求的 Realtime 条目。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      所应答的审批请求的 ID。

    - `approve: boolean`

      请求是否获得批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      该决定的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    列出 MCP 服务器上可用工具的 Realtime 项。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        有关该工具的其他注释。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    表示在 MCP 服务器上调用工具的 Realtime 项。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给工具的参数所组成的 JSON 字符串。

    - `name: string`

      已运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联审批请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      工具调用中的错误（如果有）。

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

    请求人工审批工具调用的 Realtime 项。

    - `id: string`

      审批请求的唯一 ID。

    - `arguments: string`

      该工具参数的 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.create"`

  事件类型，必须为 `conversation.item.create`.

  - `"conversation.item.create"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

- `previous_item_id: optional string`

  前置项的 ID，新项将插入到该项之后。若未设置，新项将追加到对话末尾。

  若设置为 `root`，新项将添加到对话开头。

  若设置为某个已存在的 ID，则可以在对话中间插入一个项。若找不到该 ID，将返回错误，且不会添加该项。

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

当你希望获取服务端对会话历史中某个具体 item 的表示时，发送此事件。例如，可用于在噪声消除和 VAD 之后检查用户音频。
服务端将响应一个 `conversation.item.retrieved` 事件，
除非该 item 在会话历史中不存在，
此时服务端将返回错误。

### Schema

架构名称： `RealtimeClientEventConversationItemRetrieve`

- `item_id: string`

  要检索的条目的 ID。

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

发送此事件以截断之前的助手消息中的音频。服务端
生成音频的速度快于实时，因此当用户打断以截断已发送到客户端但
尚未播放的音频时，该事件非常有用。这会使服务端对音频的
理解与客户端的播放保持一致。
理解与客户端的播放保持一致。

截断音频将删除服务端的文本转录，以确保上下文中不会
出现用户尚未听到的文本。

如果成功，服务端将返回 `conversation.item.truncated`
事件作为响应。

### Schema

架构名称： `RealtimeClientEventConversationItemTruncate`

- `audio_end_ms: number`

  音频被截断的包含性时长上限，单位为毫秒。如果
  audio_end_ms 大于实际音频时长，服务端
  将返回错误。

- `content_index: number`

  要截断的内容部分的索引。请将此值设置为 `0`.

- `item_id: string`

  要截断的助手消息条目的 ID。只有助手消息
  条目可以被截断。

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

当你想从对话历史中移除任何条目时，发送此事件。服务器将返回
history. The server will respond with a `conversation.item.deleted` 事件，
除非该 item 在会话历史中不存在，
此时服务端将返回错误。

### Schema

架构名称： `RealtimeClientEventConversationItemDelete`

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

此事件指示服务器创建一个 Response，即触发
模型推理。在 Server VAD 模式下，服务器会自动创建 Responses
。

一个 Response 至少包含一个 Item，也可能有两个，这种情况下
第二个将是一个函数调用。这些 Item 默认会追加到
对话历史中。

服务端将响应一个 `response.created` 事件、Item 事件
以及已创建的内容，最后是一个 `response.done` 事件，用于指示
Response 已完成。

该 `response.create` 事件包含推理配置，例如
`instructions` 以及 `tools`。如果设置了这些参数，它们将仅针对此 Response 覆盖 Session 的
配置。

Response 可以在默认 Conversation 之外创建，这意味着它们可以
包含任意输入，并且可以禁用将输出写入到 Conversation。
同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以并行创建多个
Response。 `metadata` 字段是区分
多个并发 Response 的好方法。

客户端可以设置 `conversation` 以 `none` 来创建一个不写入默认
会话的 Response。可以使用 `input` 字段传入任意输入，该字段是一个接受
原始 Items 以及对现有 Items 引用的数组。

### Schema

架构名称： `RealtimeClientEventResponseCreate`

- `type: "response.create"`

  事件类型，必须为 `response.create`.

  - `"response.create"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

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

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

        模型用于回复的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以通过
        一个 `id`，提供自定义声音对象，例如 `{ "id": "voice_1234" }`。在会话期间，一旦模型
        至少回复过一次音频后，就不能再更改声音。
        自定义语音必须通过音频样本创建。
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

  - `conversation: optional string or "auto" or "none"`

    控制将响应添加到哪个会话。目前支持
    `auto` 和 `none`，默认值为 `auto` 。该 `auto` 值
    表示响应的内容将被添加到默认
    会话。将其设置为 `none` 以创建不将项目添加到默认会话的带外响应，该响应
    不会向默认会话添加项目。

    - `string`

    - `"auto" or "none"`

      控制将响应添加到哪个会话。目前支持
      `auto` 和 `none`，默认值为 `auto` 。该 `auto` 值
      表示响应的内容将被添加到默认
      会话。将其设置为 `none` 以创建不将项目添加到默认会话的带外响应，该响应
      不会向默认会话添加项目。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    要在提示词中包含的输入项。使用此字段
    会为本次 Response 创建一个新的上下文，而不使用默认的
    对话。空数组 `[]` 将清除本次 Response 的上下文。
    注意，这里可以包含对会话中之前出现过的项的引用，
    通过其 id 引用。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任意时刻添加。对于会话行为的重大更改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        该项的状态。对对话无影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息项。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16-bit 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以数据 URI 的形式提供。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的文字转录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，之一，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        该项的状态。对对话无影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息条目。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字转录，当输出类型为时，该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        该项的状态。对对话无影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用条目。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        该项的状态。对对话无影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出条目。

      - `call_id: string`

        该输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，此为自由文本，可以包含任意信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新项时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        该项的状态。对对话无影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 条目。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答的审批请求的 ID。

      - `approve: boolean`

        请求是否获得批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        该决定的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的其他注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 项。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数所组成的 JSON 字符串。

      - `name: string`

        已运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用中的错误（如果有）。

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

      请求人工审批工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        该工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    在模型调用之前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型在回复内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀回复的示例”），以及在音频行为上的表现（例如“说话要快”、“在声音中注入情绪”、“经常大笑”）。指令不一定会被模型严格遵循，但它们为模型期望的行为提供了引导。
    请注意，服务端会设置默认指令，如果未设置此字段，则会使用这些默认指令，并在 `session.created` 会话开始时触发事件。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应中输出 token 的最大数量，
    其中包含工具调用。提供一个 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 指定模型可用的最大
    token 数量。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 组键值对。可用于
    以结构化格式存储对象的附加信息，并通过
    API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前可能的取值仅有
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文字转录。将
    输出设置为 mode `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以在并行状态下调用多个工具。仅支持
    以下推理 Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示词模板及其变量的引用。
    [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示词模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选映射，包含要替换到
      提示词变量中的值。替换值可以是字符串或其他
      Response 输入类型，如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](https://developers.openai.com/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，之一，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 进行较低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送到模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `file_url: optional string`

          要发送到模型的文件的 URL。

        - `filename: optional string`

          要发送到模型的文件名。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（如
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

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用特定函数。

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

  - `tools: optional array of RealtimeFunctionTool or McpTool { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括关于何时以及如何调用它的指引，
        以及在调用时向用户说明什么的指引
        （如果有的话）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        JSON Schema 中的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程模型上下文协议
      （MCP）服务器为模型提供额外的工具访问能力。 [了解更多关于 MCP 的信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or McpToolFilter { read_only, tool_names }  or null`

        允许使用的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可配合
        自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程，并在此处提供该令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其一
        `server_url`, `connector_id`，之一，或 `tunnel_id` 必须提供。了解详情
        关于服务连接器 [请参阅此处](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

        此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 使用
        通过 Secure MCP 隧道进行连接。

        当前支持 `connector_id` 的值包括：

        - Dropbox: `connector_dropbox`
        - Gmail: `connector_gmail`
        - Google Calendar: `connector_googlecalendar`
        - Google Drive: `connector_googledrive`
        - Microsoft Teams: `connector_microsoftteams`
        - Outlook 日历： `connector_outlookcalendar`
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

        此 MCP 工具是否为延迟工具，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional McpToolApprovalFilter { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要批准。可以是
          `always`, `never`，或与工具关联的过滤器对象
          需要批准的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定单个批准策略。可选值为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
          设置为 `never`，时，所有工具都不需要批准。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供以下之一 `server_url`, `connector_id`，之一，或
        `tunnel_id` 。

      - `tunnel_id: optional string`

        用于代替直接服务器 URL 的安全 MCP 隧道 ID。需提供以下之一
        `server_url`, `connector_id`，之一，或 `tunnel_id` 。

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

发送此事件以取消正在进行的响应。服务端将响应
一个 `response.done` 状态为 `response.status=cancelled`。的事件。如果有
没有可取消的响应，服务端将返回错误。即使没有进行中的响应，调用此事件也是安全的，错误将会被返回，会话不会受到影响。可以放心地调用
即使没有正在进行的响应 `response.cancel` ，错误将会被返回，会话不会受到影响。
返回，会话不会受到影响。

### Schema

架构名称： `RealtimeClientEventResponseCancel`

- `type: "response.cancel"`

  事件类型，必须为 `response.cancel`.

  - `"response.cancel"`

- `event_id: optional string`

  可选的、由客户端生成的 ID，用于标识此事件。

- `response_id: optional string`

  要取消的特定响应 ID - 如果未提供，将取消默认对话中
  正在进行的响应。

### 示例

```json
{
    "type": "response.cancel",
    "response_id": "resp_12345"
}
```

<a id="output_audio_buffer.clear"></a>

## output_audio_buffer.clear

**仅限 WebRTC/SIP：** Emit 用于截断当前的音频响应。这将触发服务端
停止生成音频并发出 `output_audio_buffer.cleared` 事件。该
事件之前应先发送一个 `response.cancel` 客户端事件以停止
当前响应的生成。
[了解更多](https://developers.openai.com/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

### Schema

架构名称： `RealtimeClientEventOutputAudioBufferClear`

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
