> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建客户端密钥

**post** `/realtime/client_secrets`

创建带有相关会话配置的 Realtime 客户端密钥。

客户端密钥是短时令牌，可传递给客户端应用，
如 Web 前端或移动客户端，从而授予对 Realtime API 的访问权限，而无需
泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义 TTL。

你还可以将会话配置选项附加到客户端密钥，这些选项将
应用于使用该客户端密钥创建的任何会话，但也可被
客户端连接覆盖。

[了解更多关于通过 WebRTC 使用客户端密钥进行身份验证的信息](/docs/guides/realtime-webrtc).

返回创建的客户端密钥和有效的会话对象。客户端密钥是一个类似 `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期的配置。过期是指在此时间之后
  客户端密钥将不再有效用于创建会话。会话本身可能
  在开始后继续运行。一个密钥可用于创建多个会话
  直到其过期。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，意味着 `seconds` 将添加到 `created_at` 客户端密钥的时间以生成过期时间戳。目前仅支持 `created_at` 。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择一个介于 `10` 和 `7200` （2小时）之间的值。如果未指定，默认值为600秒（10分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择实时
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    实时会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。对于实时 API，始终为 `realtime` 。

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

          输入音频降噪的配置。此选项可设置为 `null` 以关闭。
          降噪会过滤添加到输入音频缓冲区中的音频，然后再将其发送到 VAD 和模型。
          过滤音频可以提高 VAD 和话轮检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，例如耳机； `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认为关闭，可在开启后设置为 `null` 以关闭。输入音频转录并非模型的原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应将其视为输入音频内容的参考，而非模型实际听到的内容。客户端可以选择设置转录的语言和提示，这些为转录服务提供了额外的指导。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转录文本之前等待的时间。
            较高的值可以提高转录准确性，但会增加延迟。
            仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于指导输入音频转录的单词或短语。支持者 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            将提高准确性和延迟表现。

          - `languages: optional array of string`

            输入音频的可能语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。使用 `gpt-4o-transcribe-diarize` 当你需要带说话人标签的说话人分离时。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。使用 `gpt-4o-transcribe-diarize` 当你需要带说话人标签的说话人分离时。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            一个可选文本，用于指导模型的风格或延续之前的音频
            片段。
            对于 `whisper-1`， [提示是一组关键词](/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是一个自由文本字符串，例如“期待与科技相关的词语”。
            提示不支持与 `gpt-realtime-whisper` 。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          用于回合检测的配置，可以是服务器端 VAD 或语义 VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

          语义 VAD 更先进，使用话轮检测模型（结合 VAD）来语义评估用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以“嗯”声渐渐减弱，模型将判定话轮结束的概率较低，并等待用户继续说话更长时间。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，话轮检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

            - `type: "server_vad"`

              话轮检测类型， `server_vad` 以启用简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，若模型已在响应中，则可能无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时，超过该时间后会自动触发模型响应。这在
              用户长时间停顿出乎意料的情况下非常有用，例如电话
              通话。模型将有效地提示用户基于
              当前上下文继续对话。

              该超时值将在最后一段模型响应的音频播放完毕后生效，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联的事件）将在超时达到时触发。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断（取消）任何正在进行的、输出到默认
              对话（即。 `conversation` 的 `auto`）的响应。如果 `true` ，则响应将被取消，否则将继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静音时长（以毫秒为单位）。默认
              为 500 毫秒。较短的数值会使模型响应更快，
              但可能会在用户的短暂停顿中插入。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。阈
              值越高，需要更大的音频才能激活模型，
              因此可能在嘈杂环境中表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型判断用户是否已说完话。

            - `type: "semantic_vad"`

              话轮检测类型， `semantic_vad` 以开启语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待用户更长时间继续说话， `high` 将更快响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断任何正在进行的响应，并将输出发送到默认
              对话（即。 `conversation` 的 `auto`) 媒体通道。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型口语响应的速度，以原始速度的倍数表示。
          1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

          此参数是在音频生成后的后处理调整，
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于响应的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供带有
          一个 `id`，字段的自定义声音对象，例如 `{ "id": "voice_1234" }`。声音无法更改
          在会话期间，只要模型至少回复了一次音频。
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

      要包含在服务端输出中的附加字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      默认的系统指令（即系统消息），会前置到模型调用中。此字段允许客户端引导模型产生期望的响应。可以指示模型响应的内容和格式（例如“尽量简洁”“表现得友好”“这里有一些好的响应示例”），以及音频行为（例如“说话快一点”“在声音中注入情感”“经常笑”）。模型不保证一定会遵循这些指令，但它们为模型提供了期望行为的指引。

      请注意，服务端会设置默认指令；如果未设置此字段，将使用这些默认指令，它们会显示在会话开始时的 `session.created` 事件中。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出 token 数，
      包括工具调用。提供 1 到 4096 之间的整数以
      限制输出 token，或者使用 `inf` 以使用某个
      给定模型的可用最大 token 数。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      用于此会话的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        用于此会话的 Realtime 模型。

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
      模型将使用音频加转录文本来响应。 `["text"]` 可用于使
      模型仅以文本响应。无法同时请求 `text` 和 `audio` 两者。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅支持
      推理 Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的值映射，用于替换你的
        提示中的变量。替换值可以是字符串，也可以是其他
        Response 输入类型，如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          对模型的文本输入。

          - `text: string`

            对模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          对模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可以是 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

            要发送给模型的图片的 URL。可以是完全限定的 URL，也可以是数据 URL 中的 base64 编码图片。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 会使用高质量渲染，这可能增加输入 token 用量。使用 `low` 进行低成本渲染，或使用 `high` 以更高品质渲染文件。默认为 `auto`.

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

            标记可重用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      针对支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型如何选择工具。提供一种字符串模式，或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有的话）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定函数。

        - `name: string`

          要调用的函数名称。

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

          要在服务器上调用的工具名称。

    - `tools: optional RealtimeToolsConfig`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用
          的指导，以及调用时该告知用户什么
          （如果有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          JSON Schema 中的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议
        （MCP）服务器为模型提供额外工具。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

          允许的工具名称列表或筛选器对象。

          - `McpAllowedTools = array of string`

            允许的工具名称字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器 [标有 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              则将匹配此筛选器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可通过
          自定义 MCP 服务器 URL 或服务连接器使用。你的应用程序
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器 [请参阅此处](/docs/guides/tools-remote-mcp#connectors).

          当前支持的 `connector_id` 值为：

          - Dropbox： `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google 日历： `connector_googlecalendar`
          - Google 云端硬盘： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
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

          该 MCP 工具是否延迟并通过工具搜索发现。

        - `headers: optional map[string] or null`

          要发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他目的。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与需要审批的工具关联的筛选器对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器 [标有 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                则将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器 [标有 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                则将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一审批策略。可以是 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。必须提供以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          安全 MCP 隧道 ID，用于替代直接服务器 URL。必须提供以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
      为会话启用了 追踪，该配置便无法修改。

      `auto` 将为会话创建一个使用默认值的 追踪，其中包含
      工作流 名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        追踪 的精细配置。

        - `group_id: optional string`

          附加到此 追踪 的组 ID，用于启用筛选和
          在追踪仪表盘中进行分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于启用
          在追踪仪表盘中的筛选。

        - `workflow_name: optional string`

          要附加到此 工作流 的名称 追踪。这用于
          在追踪仪表盘中为 追踪 命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最早的开始）将不会包含在模型的上下文中。一个 32k 上下文模型，具有 4,096 个最大输出令牌，在发生截断之前只能在上下文中包含 28,224 个令牌。

      客户端可以配置截断行为，以较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方式。

      截断将减少下一轮中缓存的令牌数量（破坏缓存），因为消息从上下文开头被丢弃。然而，客户端也可以配置截断，以保留最大上下文大小的一部分内的消息，这将减少未来截断的需求，从而提高缓存利用率。

      可以完全禁用截断，这意味着服务器永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

      - `"auto" or "disabled"`

        用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将在对话超过输入令牌限制时禁用截断并发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多个轮次中分摊截断，有助于改善缓存令牌的使用。

        - `retention_ratio: number`

          当对话超过输入令牌限制时，要保留的指令后对话令牌的比例（`0.0` - `1.0`）。将其设置为 `0.8` 意味着消息将被丢弃，直到使用最大允许令牌的80%。这有助于减少截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

          - `post_instructions: optional number`

            指令后（包括工具定义）对话中允许的最大令牌数。例如，将其设置为5,000意味着当对话在指令后超过5,000个令牌时会发生截断。这不能高于模型的上下文窗口大小减去最大输出令牌数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。对于实时 API，始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。此选项可设置为 `null` 以关闭。
          降噪会过滤添加到输入音频缓冲区中的音频，然后再将其发送到 VAD 和模型。
          过滤音频可以提高 VAD 和话轮检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，例如耳机； `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认为关闭，可在开启后设置为 `null` 以关闭。输入音频转录并非模型的原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应将其视为输入音频内容的参考，而非模型实际听到的内容。客户端可以选择设置转录的语言和提示，这些为转录服务提供了额外的指导。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          用于回合检测的配置，可以是服务器端 VAD 或语义 VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

          语义 VAD 更先进，使用话轮检测模型（结合 VAD）来语义评估用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以“嗯”声渐渐减弱，模型将判定话轮结束的概率较低，并等待用户继续说话更长时间。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，话轮检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

            - `type: "server_vad"`

              话轮检测类型， `server_vad` 以启用简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，若模型已在响应中，则可能无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时，超过该时间后会自动触发模型响应。这在
              用户长时间停顿出乎意料的情况下非常有用，例如电话
              通话。模型将有效地提示用户基于
              当前上下文继续对话。

              该超时值将在最后一段模型响应的音频播放完毕后生效，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联的事件）将在超时达到时触发。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断（取消）任何正在进行的、输出到默认
              对话（即。 `conversation` 的 `auto`）的响应。如果 `true` ，则响应将被取消，否则将继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静音时长（以毫秒为单位）。默认
              为 500 毫秒。较短的数值会使模型响应更快，
              但可能会在用户的短暂停顿中插入。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。阈
              值越高，需要更大的音频才能激活模型，
              因此可能在嘈杂环境中表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型判断用户是否已说完话。

            - `type: "semantic_vad"`

              话轮检测类型， `semantic_vad` 以开启语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待用户更长时间继续说话， `high` 将更快响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断任何正在进行的响应，并将输出发送到默认
              对话（即。 `conversation` 的 `auto`) 媒体通道。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要包含在服务端输出中的附加字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### 返回

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元以来的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  会话的配置，适用于实时会话或转录会话。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    一个实时会话配置对象。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。对于实时 API，始终为 `realtime` 。

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

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。此选项可设置为 `null` 以关闭。
          降噪会过滤添加到输入音频缓冲区中的音频，然后再将其发送到 VAD 和模型。
          过滤音频可以提高 VAD 和话轮检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，例如耳机； `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转录的配置，默认为关闭，可在开启后设置为 `null` 以关闭。输入音频转录并非模型的原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应将其视为输入音频内容的参考，而非模型实际听到的内容。客户端可以选择设置转录的语言和提示，这些为转录服务提供了额外的指导。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示词，如果存在的话。

        - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

          用于回合检测的配置，可以是服务器端 VAD 或语义 VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时做出响应。

          语义 VAD 更先进，使用话轮检测模型（结合 VAD）来语义评估用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以“嗯”声渐渐减弱，模型将判定话轮结束的概率较低，并等待用户继续说话更长时间。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，话轮检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在静默一段时间后关闭。

            - `type: "server_vad"`

              话轮检测类型， `server_vad` 以启用简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，若模型已在响应中，则可能无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时，超过该时间后会自动触发模型响应。这在
              用户长时间停顿出乎意料的情况下非常有用，例如电话
              通话。模型将有效地提示用户基于
              当前上下文继续对话。

              该超时值将在最后一段模型响应的音频播放完毕后生效，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联的事件）将在超时达到时触发。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断（取消）任何正在进行的、输出到默认
              对话（即。 `conversation` 的 `auto`）的响应。如果 `true` ，则响应将被取消，否则将继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300 毫秒。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静音时长（以毫秒为单位）。默认
              为 500 毫秒。较短的数值会使模型响应更快，
              但可能会在用户的短暂停顿中插入。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。阈
              值越高，需要更大的音频才能激活模型，
              因此可能在嘈杂环境中表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型判断用户是否已说完话。

            - `type: "semantic_vad"`

              话轮检测类型， `semantic_vad` 以开启语义 VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型响应的急切程度。 `low` 将等待用户更长时间继续说话， `high` 将更快响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在 VAD 开始事件发生时自动中断任何正在进行的响应，并将输出发送到默认
              对话（即。 `conversation` 的 `auto`) 媒体通道。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型口语响应的速度，以原始速度的倍数表示。
          1.0 是默认速度。0.25 是最小速度。1.5 是最大速度。此值只能在模型轮次之间更改，不能在响应进行中更改。

          此参数是在音频生成后的后处理调整，
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于响应的语音。在模型至少响应过一次音频后，语音无法在会话期间更改。当前
          语音选项为
          语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于响应的语音。在模型至少响应过一次音频后，语音无法在会话期间更改。当前
            语音选项为
            语音选项为 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要包含在服务端输出中的附加字段。

      `item.input_audio_transcription.logprobs`：包含输入音频转录的 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      默认的系统指令（即系统消息），会前置到模型调用中。此字段允许客户端引导模型产生期望的响应。可以指示模型响应的内容和格式（例如“尽量简洁”“表现得友好”“这里有一些好的响应示例”），以及音频行为（例如“说话快一点”“在声音中注入情感”“经常笑”）。模型不保证一定会遵循这些指令，但它们为模型提供了期望行为的指引。

      请注意，服务端会设置默认指令；如果未设置此字段，将使用这些默认指令，它们会显示在会话开始时的 `session.created` 事件中。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出 token 数，
      包括工具调用。提供 1 到 4096 之间的整数以
      限制输出 token，或者使用 `inf` 以使用某个
      给定模型的可用最大 token 数。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      用于此会话的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        用于此会话的 Realtime 模型。

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
      模型将使用音频加转录文本来响应。 `["text"]` 可用于使
      模型仅以文本响应。无法同时请求 `text` 和 `audio` 两者。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的值映射，用于替换你的
        提示中的变量。替换值可以是字符串，也可以是其他
        Response 输入类型，如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          对模型的文本输入。

          - `text: string`

            对模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          对模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可以是 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

            要发送给模型的图片的 URL。可以是完全限定的 URL，也可以是数据 URL 中的 base64 编码图片。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可重用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 会使用高质量渲染，这可能增加输入 token 用量。使用 `low` 进行低成本渲染，或使用 `high` 以更高品质渲染文件。默认为 `auto`.

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

            标记可重用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      针对支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。提供一种字符串模式，或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有的话）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定函数。

        - `name: string`

          要调用的函数名称。

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

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用
          的指导，以及调用时该告知用户什么
          （如果有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          JSON Schema 中的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议
        （MCP）服务器为模型提供额外工具。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

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

          允许的工具名称列表或筛选器对象。

          - `McpAllowedTools = array of string`

            允许的工具名称字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果
              MCP 服务器 [标有 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              则将匹配此筛选器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可通过
          自定义 MCP 服务器 URL 或服务连接器使用。你的应用程序
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器 [请参阅此处](/docs/guides/tools-remote-mcp#connectors).

          当前支持的 `connector_id` 值为：

          - Dropbox： `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google 日历： `connector_googlecalendar`
          - Google 云端硬盘： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
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

          该 MCP 工具是否延迟并通过工具搜索发现。

        - `headers: optional map[string] or null`

          要发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他目的。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与需要审批的工具关联的筛选器对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器 [标有 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                则将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器 [标有 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                则将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一审批策略。可以是 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。必须提供以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          安全 MCP 隧道 ID，用于替代直接服务器 URL。必须提供以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入 [追踪仪表盘](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
      为会话启用了 追踪，该配置便无法修改。

      `auto` 将为会话创建一个使用默认值的 追踪，其中包含
      工作流 名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        追踪 的精细配置。

        - `group_id: optional string`

          附加到此 追踪 的组 ID，用于启用筛选和
          在追踪仪表盘中进行分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于启用
          在追踪仪表盘中的筛选。

        - `workflow_name: optional string`

          要附加到此 工作流 的名称 追踪。这用于
          在追踪仪表盘中为 追踪 命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着消息（从最早的开始）将不会包含在模型的上下文中。一个 32k 上下文模型，具有 4,096 个最大输出令牌，在发生截断之前只能在上下文中包含 28,224 个令牌。

      客户端可以配置截断行为，以较低的最大令牌限制进行截断，这是控制令牌使用和成本的有效方式。

      截断将减少下一轮中缓存的令牌数量（破坏缓存），因为消息从上下文开头被丢弃。然而，客户端也可以配置截断，以保留最大上下文大小的一部分内的消息，这将减少未来截断的需求，从而提高缓存利用率。

      可以完全禁用截断，这意味着服务器永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

      - `"auto" or "disabled"`

        用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将在对话超过输入令牌限制时禁用截断并发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入令牌限制时，保留对话令牌的一部分。这允许你在多个轮次中分摊截断，有助于改善缓存令牌的使用。

        - `retention_ratio: number`

          当对话超过输入令牌限制时，要保留的指令后对话令牌的比例（`0.0` - `1.0`）。将其设置为 `0.8` 意味着消息将被丢弃，直到使用最大允许令牌的80%。这有助于减少截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

          - `post_instructions: optional number`

            指令后（包括工具定义）对话中允许的最大令牌数。例如，将其设置为5,000意味着当对话在指令后超过5,000个令牌时会发生截断。这不能高于模型的上下文窗口大小减去最大输出令牌数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    一个实时转录会话配置对象。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

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

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近距离拾音麦克风，例如耳机； `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转录模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示词，如果存在的话。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          话轮检测的配置。可设置为 `null` 以关闭。服务端
          VAD 表示模型将根据
          音频音量检测语音的开始和结束，并在用户语音结束时响应。对于 `gpt-realtime-whisper`，必须设置为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            VAD 检测到语音前要包含的音频量（以
            毫秒为单位）。默认为 300 毫秒。

          - `silence_duration_ms: optional number`

            检测语音停止的静音持续时间（以毫秒为单位）。默认
            为 500 毫秒。较短的数值会使模型响应更快，
            但可能会在用户的短暂停顿中插入。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认为 0.5。一
            值越高，需要更大的音频才能激活模型，
            因此可能在嘈杂环境中表现更好。

          - `type: optional string`

            话轮检测类型，仅 `server_vad` 。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元以来的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要包含在服务端输出中的附加字段。

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
          "type": "server_vad",
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
