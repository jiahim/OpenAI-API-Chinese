# 实时客户端事件

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取相应页面的 Markdown 版本。

这些是 OpenAI Realtime WebSocket 服务器将接受来自客户端的事件。

<a id="session.update"></a>

## session.update

发送此事件以更新会话的配置。
客户端可以随时发送此事件以更新任何字段
， `voice` 和 `model`. `voice` 仅在没有其他音频输出的情况下才能更新。

当服务端收到 `session.update`，时，它将响应
一个 `session.updated` 事件，展示完整且生效的配置。
仅更新 `session.update` 中存在的字段。若要清除类似
`instructions`，的字段，请传递空字符串。若要清除类似 `tools`，的字段，请传递空数组。
若要清除类似 `turn_detection`，的字段，请传递 `null`.

### Schema

架构名称： `RealtimeClientEventSessionUpdate`

- `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  更新 Realtime 会话。选择 realtime
  会话或 transcription 会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。对于 Realtime API，该值始终 `realtime` 。

      - `"realtime"`

    - `audio: optional RealtimeAudioConfig`

      输入和输出音频的配置。

      - `input: optional RealtimeAudioConfigInput`

        - `format: optional RealtimeAudioFormats`

          输入音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率，始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式，始终为 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式，始终为 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式，始终为 `audio/pcma`.

              - `"audio/pcma"`

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以通过改善输入音频的感知效果，提升 VAD 和 turn 检测的准确率（降低误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离通话麦克风（例如耳机）， `far_field` 适用于远场麦克风（例如笔记本或会议室麦克风）。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录配置，默认关闭，可设置为 `null` to turn off once on. 输入音频转录并非模型的原生功能，因为模型直接消费音频。转录通过以下接口异步运行 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 进行，应将其视为对输入音频内容的引导，而非模型所听到的精确内容。客户端可选择性地设置转录的语言和提示，以为转录服务提供额外引导。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转录文本之前等待的时间。
            较高的值可以提高转录准确率，但会增加延迟。
            仅在 GA 实时会话中支持使用 `gpt-realtime-whisper` 。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转录的单词或短语。支持使用 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供
            将提高准确率和延迟表现。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持使用 `gpt-transcribe` 和 `gpt-live-transcribe`.

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

            用于引导模型风格或延续上一段音频的可选文本
            片段。
            对于 `whisper-1`,prompt [是一组关键词列表](https://developers.openai.com/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`),prompt 是自由文本字符串，例如 “expect words related to technology”。
            Prompt 不支持用于 `gpt-realtime-whisper` 。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以将该参数设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义层面地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户语音在 “uhhm” 处逐渐减弱，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须设置为
          ；不支持 VAD。 `null`。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以启用简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` 如果模型已经在响应,这可能会导致无法创建响应。

              如果两者同时 `create_response` 和 `interrupt_response` 设置为 `false`,模型将永远不会自动响应,但 VAD 事件仍会发出。

            - `idle_timeout_ms: optional number or null`

              用于在经过一段可选的超时时间后自动触发模型响应的超时设置。该设置在以下场景中非常有用:用户长时间停顿属于意外情况,例如电话通话
              。此时模型会基于当前上下文有效地提示用户继续对话
              。模型实际上会根据当前上下文提示用户继续对话
              当前上下文。

              该超时值将在上一次模型响应的音频播放结束后开始计时,
              即该值被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件(以及与该 Response 相关的
              事件)将在达到超时时间时触发。
              空闲超时目前仅在 `server_vad` 模式下受支持。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时,是否自动中断(取消)任何正在进行中、并向默认
              会话(即。 `conversation` 的 `auto`)输出内容的响应。如果 `true` 响应会被取消，否则会继续执行直到完成。

              如果两者同时 `create_response` 和 `interrupt_response` 设置为 `false`,模型将永远不会自动响应,但 VAD 事件仍会发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静音时长（以毫秒为单位）。默认为
              500ms。值越小，模型响应越快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较高的
              阈值要求更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地做出响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8s、4s 和 2s 的最大超时时间。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在默认输出设备上自动中断任何正在进行的响应
              会话(即。 `conversation` 的 `auto`) 当 VAD 开始事件发生时。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回复的速度，相对于原始速度的倍数。
          1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

          该参数是对生成后音频的后处理调整，也可以
          通过提示模型让其说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回复的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如
          一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经使用音频回复过一次，
          在会话进行期间就无法再更改声音。
          我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      添加到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的回复。可以指示模型回复的内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好的回复示例”），以及音频行为（例如“说得快一些”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了指导。

      请注意，服务端会设置默认指令，当该字段未设置时将使用这些默认指令，并且它们会在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应中可输出的最大 token 数，
      包含工具调用在内。提供介于 1 到 4096 之间的整数以
      限制输出 token 数，或 `inf` 对于给定模型的最大可用 token 数。默认值为
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

      模型可以响应的模态集合。默认值为 `["audio"]`,表示
      模型将以音频加文字转录进行响应。 `["text"]` 可用于使
      模型仅以文本进行响应。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅受
      等推理 Realtime 模型支持。 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射值，用于替换你的
        提示中的变量。替换值可以是字符串，也可以是其他
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

            要发送给模型的文件的 ID。

          - `image_url: optional string or null`

            要发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

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

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 会使用高质量渲染，可能会增加输入 token 数量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        可选的提示模板版本。

    - `reasoning: optional RealtimeReasoning`

      用于具备推理能力的 Realtime 模型的配置，例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制具备推理能力的 Realtime 模型的推理投入程度，例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型选择工具的方式。提供以下字符串模式之一，或强制指定特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制由模型调用哪些工具（如果有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

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

          要在服务器上调用的工具的名称。

    - `tools: optional RealtimeToolsConfig`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用它的指南，以及在调用时该向用户说明什么的指南
          （如果有的话）。
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
        （MCP）服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

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

          允许的工具名称列表或筛选器对象。

          - `McpAllowedTools = array of string`

            由允许的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则它将匹配此筛选器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可与远程 MCP 服务器一起使用的 OAuth 访问令牌，可以与
          自定义 MCP 服务器 URL 或服务连接器配合使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中的
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解详情请参阅
          服务连接器 [此处](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          对于 2026-09-01 之后发布的模型，此字段已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或使用 `tunnel_id` 通过
          安全 MCP 隧道进行连接。

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

          此 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或是与工具关联的筛选器对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则它将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则它将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可为 `always` 或
            `never`。之一。设置为 `always`，时，所有工具都需要审批。当设置为
            ；不支持 VAD。 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
      为某个会话启用了追踪，就无法再修改配置。

      `auto` 会使用默认值创建该会话的追踪，包括
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        针对追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪上的组 ID，用于在 Traces Dashboard 中进行过滤和
          分组。

        - `metadata: optional unknown`

          附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
          过滤功能。

        - `workflow_name: optional string`

          附加到此工作流的工作流名称。它用于
          在 Traces Dashboard 中命名该追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的开始）不会包含在模型的上下文中。一个具有 4,096 最大输出 token 的 32k 上下文模型，在截断发生前只能在上下文中包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用和成本的有效方法。

      截断会减少下一轮中被缓存的 token 数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为在达到最大上下文大小的某个比例时保留消息，这将减少未来截断的需要，从而提高缓存命中率。

      截断可以完全禁用，这意味着服务端永远不会截断，而是在对话超过模型的输入 token 上限时返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        在对话超过输入 token 上限时，保留对话 token 的一部分。这允许你在多轮之间分摊截断，有助于提升缓存 token 的使用效率。

        - `retention_ratio: number`

          指令后对话中保留的 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限时生效。将该值设为 `0.8` 表示会丢弃消息，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用按保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。若未提供，则使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后（包含工具定义）对话允许的最大 token 数。例如，设为 5,000 表示当对话的 token 数（不含指令）超过 5,000 时触发截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转写会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。对于 Realtime API，该值始终 `transcription` 用于转写会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以通过改善输入音频的感知效果，提升 VAD 和 turn 检测的准确率（降低误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离通话麦克风（例如耳机）， `far_field` 适用于远场麦克风（例如笔记本或会议室麦克风）。

        - `transcription: optional AudioTranscription`

          输入音频转录配置，默认关闭，可设置为 `null` to turn off once on. 输入音频转录并非模型的原生功能，因为模型直接消费音频。转录通过以下接口异步运行 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 进行，应将其视为对输入音频内容的引导，而非模型所听到的精确内容。客户端可选择性地设置转录的语言和提示，以为转录服务提供额外引导。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以将该参数设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 表示模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义层面地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户语音在 “uhhm” 处逐渐减弱，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须设置为
          ；不支持 VAD。 `null`。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以启用简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` 如果模型已经在响应,这可能会导致无法创建响应。

              如果两者同时 `create_response` 和 `interrupt_response` 设置为 `false`,模型将永远不会自动响应,但 VAD 事件仍会发出。

            - `idle_timeout_ms: optional number or null`

              用于在经过一段可选的超时时间后自动触发模型响应的超时设置。该设置在以下场景中非常有用:用户长时间停顿属于意外情况,例如电话通话
              。此时模型会基于当前上下文有效地提示用户继续对话
              。模型实际上会根据当前上下文提示用户继续对话
              当前上下文。

              该超时值将在上一次模型响应的音频播放结束后开始计时,
              即该值被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件(以及与该 Response 相关的
              事件)将在达到超时时间时触发。
              空闲超时目前仅在 `server_vad` 模式下受支持。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时,是否自动中断(取消)任何正在进行中、并向默认
              会话(即。 `conversation` 的 `auto`)输出内容的响应。如果 `true` 响应会被取消，否则会继续执行直到完成。

              如果两者同时 `create_response` 和 `interrupt_response` 设置为 `false`,模型将永远不会自动响应,但 VAD 事件仍会发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静音时长（以毫秒为单位）。默认为
              500ms。值越小，模型响应越快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较高的
              阈值要求更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地做出响应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 分别具有 8s、4s 和 2s 的最大超时时间。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在默认输出设备上自动中断任何正在进行的响应
              会话(即。 `conversation` 的 `auto`) 当 VAD 开始事件发生时。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

- `type: "session.update"`

  事件类型，必须为 `session.update`.

  - `"session.update"`

- `event_id: optional string`

  可选的客户端生成 ID，用于标识此事件。客户端可以为它分配任意字符串。如果事件发生错误，该 ID 会被回传，但对应的 `session.updated` 事件将不包含该 ID。

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

发送此事件可将音频字节追加到输入音频缓冲区。该音频
缓冲区是一个可写入的临时存储，之后可以提交。一次“提交”会基于缓冲区
内容在对话历史中创建一条新的用户消息项，并清空缓冲区。
输入音频转录（如果已启用）将在缓冲区提交时生成。

如果启用了 VAD，音频缓冲区将用于检测语音，并由服务端决定何时
提交。当服务端 VAD 被禁用时，你必须手动提交音频缓冲区。
输入音频降噪作用于对音频缓冲区的写入操作。

客户端可以选择每个事件中放入的音频量，最大为
15 MiB；例如从客户端流式传输较小的分块可使
VAD 响应更及时。与大多数其他客户端事件不同，服务端不
会针对此事件发送确认响应。

### Schema

架构名称： `RealtimeClientEventInputAudioBufferAppend`

- `audio: string`

  Base64 编码的音频字节。格式必须与会话配置中的
  `input_audio_format` 字段指定的一致。

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

发送该事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，发送该事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

提交输入音频缓冲区将触发输入音频转录（如果在会话配置中已启用），但不会让模型生成响应。服务端将返回 `input_audio_buffer.committed` 事件。

### Schema

架构名称： `RealtimeClientEventInputAudioBufferCommit`

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

发送此事件以清除缓冲区中的音频字节。服务器将
响应一个 `input_audio_buffer.cleared` 事件。

### Schema

架构名称： `RealtimeClientEventInputAudioBufferClear`

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

向对话的上下文中添加一个新条目，包括消息、函数
调用和函数调用响应。此事件既可用于填充对话的
“历史记录”，也可用于在流式传输过程中添加新条目，但目前有一个
限制，即无法填充助手音频消息。

如果成功，服务端将发出一个 `conversation.item.added` event and,
当 item 最终确定时，会发送一个 `conversation.item.done` event。否则，将发送一个
`error` event。

### Schema

架构名称： `RealtimeClientEventConversationItemCreate`

- `item: ConversationItem`

  Realtime 对话中的单个 item。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任何时点添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。对于系统消息，固定为 `input_text` 。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。固定为 `system`.

      - `"system"`

    - `type: "message"`

      item 的类型。固定为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条用户消息 item。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（适用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的细节级别（适用于 `input_image`). `auto` ）将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（适用于 `input_image`），以数据 URI 形式呈现。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（适用于 `input_text`).

      - `transcript: optional string`

        音频的转录文本（适用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。固定为 `user`.

      - `"user"`

    - `type: "message"`

      item 的类型。固定为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

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

        经过 Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的转录文本，如果输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。固定为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      item 的类型。固定为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    实时对话中的一项函数调用项。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      item 的类型。固定为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    实时对话中的一项函数调用输出项。

    - `call_id: string`

      该输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

    - `type: "function_call_output"`

      item 的类型。固定为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      item 的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    用于响应 MCP 审批请求的实时项。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已被批准。

    - `type: "mcp_approval_response"`

      item 的类型。固定为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      可选的决策原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 项，列出 MCP 服务器上可用的工具。

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

      item 的类型。固定为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      已运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      item 的类型。固定为 `mcp_call`.

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

    一个 Realtime 项，请求人工批准一次工具调用。

    - `id: string`

      批准请求的唯一 ID。

    - `arguments: string`

      传递给工具的参数的 JSON 字符串。

    - `name: string`

      要运行的工具的名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      item 的类型。固定为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.create"`

  事件类型，必须为 `conversation.item.create`.

  - `"conversation.item.create"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

- `previous_item_id: optional string`

  前置项的 ID，新项将插入到该项之后。若未设置，新项将追加到对话末尾。

  若设置为 `root`，新项将添加到对话开头。

  若设置为某个已存在的 ID，则可在对话中间插入一项。若找不到该 ID，将返回错误且不会添加该项。

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

当你希望检索服务端对会话历史中某个具体条目（item）的表示时，发送此事件。例如，可用于在噪声消除和 VAD 之后检查用户音频。
服务端将使用一个 `conversation.item.retrieved` 事件进行响应，
除非该条目在会话历史中不存在，这种情况下
服务端将返回错误。

### Schema

架构名称： `RealtimeClientEventConversationItemRetrieve`

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

发送此事件以截断之前助手消息的音频。服务端
会以快于实时的速度生成音频，因此当用户
打断并截断已发送到客户端但尚未播放的音频时，
此事件非常有用。这将使服务端对音频的理解与
客户端的播放保持同步。

截断音频会删除 服务端 文本转写，以确保
上下文中不会出现用户尚未听到的文本。

如果成功，服务端将响应一个 `conversation.item.truncated`
事件。

### Schema

架构名称： `RealtimeClientEventConversationItemTruncate`

- `audio_end_ms: number`

  对音频进行截断的最大包含时长，单位为毫秒。如果
  audio_end_ms 大于实际音频时长，服务端
  将返回错误。

- `content_index: number`

  要截断的内容部分的索引。将其设置为 `0`.

- `item_id: string`

  要截断的助手消息项的 ID。仅助手消息
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

当你想要从对话中移除任何条目时发送此事件
历史记录。服务端将响应一个 `conversation.item.deleted` 事件进行响应，
除非该条目在会话历史中不存在，这种情况下
服务端将返回错误。

### Schema

架构名称： `RealtimeClientEventConversationItemDelete`

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
模型推理。在 Server VAD 模式下，服务端会自动创建 Responses
。

一个 Response 至少包含一个 Item，也可能包含两个，此时
第二个将是一个函数调用。这些 Item 默认会被追加到
对话历史中。

服务端将使用一个 `response.created` 事件、Item 的 events
和创建的内容，以及最终的 `response.done` 事件，用于指示
Response 已完成。

该 `response.create` 事件包含推理配置，例如
`instructions` 和 `tools`。如果设置了这些参数，它们将仅针对此 Response 覆盖 Session 的
配置。

Responses 可以在默认 Conversation 之外创建，这意味着它们可以
接收任意输入，并且可以禁用将输出写入 Conversation。
同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以有多个
Responses 并行创建。 `metadata` 字段是区分
多个并发 Response 的好方法。

客户端可以设置 `conversation` 以 `none` 以创建一个不会写入默认
会话的 Response。可以使用 `input` 字段提供任意输入，该字段是一个接受
原始 Items 和对现有 Items 引用的数组。

### Schema

架构名称： `RealtimeClientEventResponseCreate`

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

            音频的采样率，始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式，始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式，始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式，始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于回复的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如
        一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经使用音频回复过一次，
        在会话进行期间就无法再更改声音。
        我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

  - `conversation: optional string or "auto" or "none"`

    控制将该响应添加到哪个对话。当前支持
    `auto` 和 `none`，默认值为 `auto` 。该 `auto` 值
    表示响应的内容将被添加到默认
    对话中。将其设置为 `none` 以创建一个不会向默认对话
    添加条目的带外响应。

    - `string`

    - `"auto" or "none"`

      控制将该响应添加到哪个对话。当前支持
      `auto` 和 `none`，默认值为 `auto` 。该 `auto` 值
      表示响应的内容将被添加到默认
      对话中。将其设置为 `none` 以创建一个不会向默认对话
      添加条目的带外响应。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    包含在模型提示中的输入条目。使用此字段
    会为该 Response 创建一个新的上下文，而不是使用默认
    对话。空数组 `[]` 将清除该 Response 的上下文。
    请注意，这可以包括对会话中先前出现过的条目的引用，
    通过其 id。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任何时点添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息，固定为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。固定为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。固定为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条用户消息 item。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（适用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（适用于 `input_image`). `auto` ）将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（适用于 `input_image`），以数据 URI 形式呈现。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（适用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（适用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。固定为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。固定为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

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

          经过 Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。固定为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。固定为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。固定为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        该输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。固定为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回 API 对象的标识符——始终为 `realtime.item`。创建新 item 时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        item 的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已被批准。

      - `type: "mcp_approval_response"`

        item 的类型。固定为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

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

        item 的类型。固定为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        已运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。固定为 `mcp_call`.

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

      一个 Realtime 项，请求人工批准一次工具调用。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。固定为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    默认的系统指令（即系统消息），会添加到模型调用之前。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式方面（例如 "非常简洁"、"表现得友好一些"、"以下是一些良好响应的示例"）以及音频行为方面（例如 "说话快一点"、"在声音中加入情感"、"经常笑"）的行为。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。
    请注意，服务端会设置默认指令，当该字段未设置时将使用这些默认指令，并且它们会在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应中可输出的最大 token 数，
    包含工具调用在内。提供介于 1 到 4096 之间的整数以
    限制输出 token 数，或 `inf` 对于给定模型的最大可用 token 数。默认值为
    给定模型的最大可用 token 数。默认值为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，并通过 API 或仪表板查询对象。
    。

    键为字符串，最长 64 个字符。值为字符串
    ，最长 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的值是
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    输出设为该 `text` 模式将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅受
    等推理 Realtime 模型支持。 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射值，用于替换你的
      提示中的变量。替换值可以是字符串，也可以是其他
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

          要发送给模型的文件的 ID。

        - `image_url: optional string or null`

          要发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

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

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 会使用高质量渲染，可能会增加输入 token 数量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      可选的提示模板版本。

  - `reasoning: optional RealtimeReasoning`

    用于具备推理能力的 Realtime 模型的配置，例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制具备推理能力的 Realtime 模型的推理投入程度，例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型选择工具的方式。提供以下字符串模式之一，或强制指定特定的
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制由模型调用哪些工具（如果有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

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

        要在服务器上调用的工具的名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何调用它的指南，以及在调用时该向用户说明什么的指南
        （如果有的话）。
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
      （MCP）服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

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

        允许的工具名称列表或筛选器对象。

        - `McpAllowedTools = array of string`

          由允许的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的筛选器对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，则它将匹配此筛选器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可与远程 MCP 服务器一起使用的 OAuth 访问令牌，可以与
        自定义 MCP 服务器 URL 或服务连接器配合使用。你的应用
        必须处理 OAuth 授权流程并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中的
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解详情请参阅
        服务连接器 [此处](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

        对于 2026-09-01 之后发布的模型，此字段已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或使用 `tunnel_id` 通过
        安全 MCP 隧道进行连接。

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

        此 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或是与工具关联的筛选器对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则它将匹配此筛选器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则它将匹配此筛选器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可为 `always` 或
          `never`。之一。设置为 `always`，时，所有工具都需要审批。当设置为
          ；不支持 VAD。 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供
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

发送此事件以取消正在进行中的响应。服务端将返回
一个 `response.done` 一个状态为 `response.status=cancelled`。的事件。如果没有
可取消的响应，服务端将返回错误。即使没有响应正在进行，调用
也是安全的，即使没有响应正在进行，也会返回错误， `response.cancel` 即使没有响应正在进行，也会返回错误，
会话将保持不受影响。

### Schema

架构名称： `RealtimeClientEventResponseCancel`

- `type: "response.cancel"`

  事件类型，必须为 `response.cancel`.

  - `"response.cancel"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识此事件。

- `response_id: optional string`

  要取消的特定响应 ID - 如果未提供，将取消默认会话中
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

**仅限 WebRTC/SIP：** Emit 用于中止当前的音频响应。这将触发服务端
停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
事件应在此之前由一个 `response.cancel` 客户端事件用于停止当前响应的
生成。
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
